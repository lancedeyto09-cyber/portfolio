<?php

namespace Tests\Feature\Admin;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProjectValidationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->actingAs(User::factory()->create());
    }

    public function test_empty_form_is_rejected_without_creating_a_project(): void
    {
        $this->from(route('admin.projects.create'))
            ->post(route('admin.projects.store'), [])
            ->assertRedirect(route('admin.projects.create'))
            ->assertSessionHasErrors(['title', 'description', 'tech_stack']);

        $this->assertDatabaseCount('projects', 0);
    }

    public function test_title_longer_than_255_characters_is_rejected(): void
    {
        $this->from(route('admin.projects.create'))
            ->post(route('admin.projects.store'), $this->validProject([
                'title' => str_repeat('T', 256),
            ]))
            ->assertRedirect(route('admin.projects.create'))
            ->assertSessionHasErrors('title');

        $this->assertDatabaseCount('projects', 0);
    }

    public function test_invalid_project_url_is_rejected_and_other_input_is_preserved(): void
    {
        $input = $this->validProject([
            'project_url' => 'not-a-valid-url',
        ]);

        $this->from(route('admin.projects.create'))
            ->post(route('admin.projects.store'), $input)
            ->assertRedirect(route('admin.projects.create'))
            ->assertSessionHasErrors('project_url')
            ->assertSessionHas('_old_input.title', $input['title'])
            ->assertSessionHas('_old_input.description', $input['description'])
            ->assertSessionHas('_old_input.project_url', $input['project_url']);

        $this->assertDatabaseCount('projects', 0);
    }

    public function test_duplicate_title_is_rejected_with_the_custom_message(): void
    {
        Project::create($this->validProject());

        $this->from(route('admin.projects.create'))
            ->post(route('admin.projects.store'), $this->validProject())
            ->assertRedirect(route('admin.projects.create'))
            ->assertSessionHasErrors([
                'title' => 'The project title is already in use. Please choose a different title.',
            ]);

        $this->assertDatabaseCount('projects', 1);
    }

    public function test_update_accepts_the_existing_title_and_saves_other_changes(): void
    {
        $project = Project::create($this->validProject());

        $this->put(route('admin.projects.update', $project), $this->validProject([
            'description' => 'Updated description while keeping its title.',
        ]))
            ->assertRedirect(route('admin.projects.index'))
            ->assertSessionHas('success', 'Project updated successfully.');

        $this->assertDatabaseCount('projects', 1);
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'title' => 'Validation Example',
            'description' => 'Updated description while keeping its title.',
        ]);
    }

    public function test_text_file_is_rejected_as_a_project_image(): void
    {
        Storage::fake('public');

        $this->from(route('admin.projects.create'))
            ->post(route('admin.projects.store'), [
                ...$this->validProject(),
                'image' => UploadedFile::fake()->create(
                    'notes.txt',
                    10,
                    'text/plain'
                ),
            ])
            ->assertRedirect(route('admin.projects.create'))
            ->assertSessionHasErrors('image');

        $this->assertDatabaseCount('projects', 0);
        $this->assertSame([], Storage::disk('public')->allFiles('projects'));
    }

    public function test_valid_image_larger_than_2_mb_is_rejected_and_not_stored(): void
    {
        Storage::fake('public');

        $png = base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADUlEQVR4nGP4z8AAAAMBAQDJ/pLvAAAAAElFTkSuQmCC',
            true
        );
        $oversizedImage = UploadedFile::fake()->createWithContent(
            'large.png',
            $png.str_repeat('x', (2 * 1024 * 1024) + 1)
        );

        $this->from(route('admin.projects.create'))
            ->post(route('admin.projects.store'), [
                ...$this->validProject(),
                'image' => $oversizedImage,
            ])
            ->assertRedirect(route('admin.projects.create'))
            ->assertSessionHasErrors([
                'image' => 'The image must not be larger than 2 MB.',
            ]);

        $this->assertDatabaseCount('projects', 0);
        $this->assertSame([], Storage::disk('public')->allFiles('projects'));
    }

    public function test_future_completion_date_is_rejected_without_creating_a_project(): void
    {
        $this->from(route('admin.projects.create'))
            ->post(route('admin.projects.store'), $this->validProject([
                'date_completed' => now()->addDay()->toDateString(),
            ]))
            ->assertRedirect(route('admin.projects.create'))
            ->assertSessionHasErrors('date_completed');

        $this->assertDatabaseCount('projects', 0);
    }

    /**
     * @return array<string, mixed>
     */
    private function validProject(array $overrides = []): array
    {
        return array_replace([
            'title' => 'Validation Example',
            'description' => 'A valid project description for validation tests.',
            'tech_stack' => ['Laravel', 'React'],
            'project_url' => null,
            'repository_url' => null,
            'date_completed' => null,
        ], $overrides);
    }
}
