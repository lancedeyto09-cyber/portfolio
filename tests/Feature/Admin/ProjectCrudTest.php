<?php

namespace Tests\Feature\Admin;

use App\Models\Project;
use App\Models\User;
use Database\Seeders\ProjectSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProjectCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_project_management_is_available_without_registration(): void
    {
        $project = Project::create($this->validProject());

        $this->get(route('admin.projects.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Admin/Projects/Index'));
        $this->get(route('admin.projects.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Admin/Projects/Create'));
        $this->get(route('admin.projects.edit', $project))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Admin/Projects/Edit'));

        $this->post(route('admin.projects.store'), $this->validProject([
            'title' => 'Guest Created Project',
        ]))
            ->assertRedirect(route('admin.projects.index'))
            ->assertSessionHas('success', 'Project created successfully.');

        $created = Project::query()->where('title', 'Guest Created Project')->sole();
        $this->put(route('admin.projects.update', $created), $this->validProject([
            'title' => 'Guest Created Project',
            'description' => 'Updated without needing an account.',
        ]))
            ->assertRedirect(route('admin.projects.index'))
            ->assertSessionHas('success', 'Project updated successfully.');

        $this->assertSame(
            'Updated without needing an account.',
            $created->fresh()->description
        );

        $this->delete(route('admin.projects.destroy', $created))
            ->assertRedirect(route('admin.projects.index'))
            ->assertSessionHas('success', 'Project deleted successfully.');

        $this->assertDatabaseMissing('projects', ['id' => $created->id]);
    }

    public function test_authenticated_user_can_create_and_view_a_project(): void
    {
        $this->actingAs(User::factory()->create());

        $this->get(route('admin.projects.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Admin/Projects/Create'));

        $this->post(route('admin.projects.store'), $this->validProject())
            ->assertRedirect(route('admin.projects.index'))
            ->assertSessionHas('success', 'Project created successfully.');

        $project = Project::query()->sole();
        $this->assertSame(['Laravel', 'React'], $project->tech_stack);

        $this->get(route('admin.projects.edit', $project))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Projects/Edit')
                ->where('project.title', 'Portfolio Example'));

        $this->get(route('admin.projects.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Projects/Index')
                ->has('projects.data', 1)
                ->where('projects.data.0.title', 'Portfolio Example'));
    }

    public function test_project_title_must_be_unique_and_uses_a_custom_message(): void
    {
        $this->actingAs(User::factory()->create());
        Project::create($this->validProject());

        $this->from(route('admin.projects.create'))
            ->post(route('admin.projects.store'), $this->validProject())
            ->assertRedirect(route('admin.projects.create'))
            ->assertSessionHasErrors([
                'title' => 'The project title is already in use. Please choose a different title.',
            ]);
    }

    public function test_update_ignores_the_current_title_and_preserves_a_missing_image(): void
    {
        $this->actingAs(User::factory()->create());
        Storage::fake('public');
        Storage::disk('public')->put('projects/portfolio.png', 'existing-image');

        $project = Project::create([
            ...$this->validProject(),
            'image' => 'projects/portfolio.png',
        ]);

        $this->put(route('admin.projects.update', $project), [
            ...$this->validProject(),
            'description' => 'Updated project description.',
        ])->assertRedirect(route('admin.projects.index'))
            ->assertSessionHas('success', 'Project updated successfully.');

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'title' => 'Portfolio Example',
            'description' => 'Updated project description.',
            'image' => 'projects/portfolio.png',
        ]);
        Storage::disk('public')->assertExists('projects/portfolio.png');
    }

    public function test_duplicate_title_is_rejected_when_updating_another_project(): void
    {
        $this->actingAs(User::factory()->create());
        $first = Project::create($this->validProject());
        $second = Project::create($this->validProject([
            'title' => 'Another Project',
        ]));

        $this->put(route('admin.projects.update', $second), $this->validProject())
            ->assertSessionHasErrors('title');

        $this->assertSame('Another Project', $second->fresh()->title);
        $this->assertSame('Portfolio Example', $first->fresh()->title);
    }

    public function test_project_fields_and_image_are_validated(): void
    {
        $this->actingAs(User::factory()->create());

        $this->from(route('admin.projects.create'))
            ->post(route('admin.projects.store'), [
                'title' => '',
                'description' => 'short',
                'tech_stack' => [],
                'project_url' => 'not a URL',
                'repository_url' => 'not a URL',
                'image' => UploadedFile::fake()->create('notes.txt', 10, 'text/plain'),
                'date_completed' => now()->addDay()->toDateString(),
            ])
            ->assertRedirect(route('admin.projects.create'))
            ->assertSessionHasErrors([
                'title',
                'description',
                'tech_stack',
                'project_url',
                'repository_url',
                'image',
                'date_completed',
            ]);

        $this->from(route('admin.projects.create'))
            ->post(route('admin.projects.store'), [
                ...$this->validProject(),
                'image' => UploadedFile::fake()->create(
                    'large.png',
                    2049,
                    'image/png'
                ),
            ])
            ->assertRedirect(route('admin.projects.create'))
            ->assertSessionHasErrors('image');
    }

    public function test_replacing_and_deleting_a_project_removes_its_old_image(): void
    {
        $this->actingAs(User::factory()->create());
        Storage::fake('public');
        Storage::disk('public')->put('projects/old.png', 'old-image');

        $project = Project::create([
            ...$this->validProject(),
            'image' => 'projects/old.png',
        ]);

        $this->post(route('admin.projects.update', $project), [
            ...$this->validProject(),
            '_method' => 'put',
            'image' => UploadedFile::fake()->createWithContent(
                'replacement.png',
                base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADUlEQVR4nGP4z8AAAAMBAQDJ/pLvAAAAAElFTkSuQmCC')
            ),
        ])->assertRedirect(route('admin.projects.index'));

        $replacement = $project->fresh()->image;
        $this->assertNotSame('projects/old.png', $replacement);
        Storage::disk('public')->assertMissing('projects/old.png');
        Storage::disk('public')->assertExists($replacement);

        $this->delete(route('admin.projects.destroy', $project))
            ->assertRedirect(route('admin.projects.index'))
            ->assertSessionHas('success', 'Project deleted successfully.');

        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
        Storage::disk('public')->assertMissing($replacement);
    }

    public function test_public_portfolio_uses_database_projects_and_supports_an_empty_state(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Portfolio/Index')
                ->has('projects', 0));

        $project = Project::create($this->validProject([
            'project_url' => 'https://example.test/project',
            'repository_url' => 'https://github.com/example/project',
            'image' => 'projects/portfolio.webp',
        ]));

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Portfolio/Index')
                ->has('projects', 1)
                ->where('projects.0.id', $project->id)
                ->where('projects.0.tech_stack.0', 'Laravel')
                ->where('projects.0.project_url', 'https://example.test/project')
                ->where('projects.0.repository_url', 'https://github.com/example/project')
                ->where('projects.0.image_url', '/storage/projects/portfolio.webp'));
    }

    public function test_project_index_search_filters_by_title_and_paginates(): void
    {
        $this->actingAs(User::factory()->create());

        foreach (range(1, 12) as $number) {
            Project::create($this->validProject([
                'title' => "Search Example {$number}",
            ]));
        }

        $this->get(route('admin.projects.index', ['search' => 'Example 1']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Projects/Index')
                ->where('projects.total', 4)
                ->where('filters.search', 'Example 1'));

        $this->get(route('admin.projects.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->has('projects.data', 10)
                ->where('projects.total', 12));
    }

    public function test_project_seeder_can_be_run_repeatedly_without_duplicates(): void
    {
        $this->seed(ProjectSeeder::class);
        $this->seed(ProjectSeeder::class);

        $this->assertDatabaseCount('projects', 3);
    }

    /**
     * @return array<string, mixed>
     */
    private function validProject(array $overrides = []): array
    {
        return array_replace([
            'title' => 'Portfolio Example',
            'description' => 'A sample project description for CRUD tests.',
            'tech_stack' => ['Laravel', 'React'],
            'project_url' => null,
            'repository_url' => null,
            'image' => null,
            'date_completed' => null,
        ], $overrides);
    }
}
