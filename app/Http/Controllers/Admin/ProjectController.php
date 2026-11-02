<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;
use Throwable;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
        ]);

        $projects = Project::query()
            ->when(
                $validated['search'] ?? null,
                fn ($query, $search) => $query->where('title', 'like', "%{$search}%")
            )
            ->orderBy('title')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Project $project) => $this->presentProject($project));

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects,
            'filters' => ['search' => $validated['search'] ?? ''],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Projects/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatedProject($request);
        $image = $validated['image'] ?? null;
        unset($validated['image']);

        if ($image instanceof UploadedFile) {
            $validated['image'] = $this->storeProjectImage($image);
        }

        try {
            DB::transaction(fn () => Project::create($validated));
        } catch (Throwable $exception) {
            if (isset($validated['image'])) {
                $this->deleteProjectImage($validated['image']);
            }

            throw $exception;
        }

        return to_route('admin.projects.index')
            ->with('success', 'Project created successfully.');
    }

    public function edit(Project $project): Response
    {
        return Inertia::render('Admin/Projects/Edit', [
            'project' => $this->presentProject($project),
        ]);
    }

    public function update(Request $request, Project $project): RedirectResponse
    {
        $validated = $this->validatedProject($request, $project);
        $replacement = $validated['image'] ?? null;
        unset($validated['image']);

        $previousImage = $project->image;

        if ($replacement instanceof UploadedFile) {
            $validated['image'] = $this->storeProjectImage($replacement);
        }

        try {
            DB::transaction(fn () => $project->update($validated));
        } catch (Throwable $exception) {
            if (isset($validated['image'])) {
                $this->deleteProjectImage($validated['image']);
            }

            throw $exception;
        }

        if (isset($validated['image']) && $previousImage) {
            $this->deleteProjectImage($previousImage);
        }

        return to_route('admin.projects.index')
            ->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project): RedirectResponse
    {
        $image = $project->image;
        DB::transaction(fn () => $project->delete());

        if ($image) {
            $this->deleteProjectImage($image);
        }

        return to_route('admin.projects.index')
            ->with('success', 'Project deleted successfully.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validatedProject(Request $request, ?Project $project = null): array
    {
        return Validator::make($request->all(), [
            'title' => [
                'required',
                'string',
                'max:255',
                Rule::unique('projects', 'title')->ignore($project?->id),
            ],
            'description' => ['required', 'string', 'min:10', 'max:5000'],
            'tech_stack' => ['required', 'array', 'min:1'],
            'tech_stack.*' => ['required', 'string', 'max:100'],
            'project_url' => ['nullable', 'url', 'max:255'],
            'repository_url' => ['nullable', 'url', 'max:255'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'date_completed' => ['nullable', 'date', 'before_or_equal:today'],
        ], [
            'title.required' => 'Please enter a project title.',
            'title.unique' => 'The project title is already in use. Please choose a different title.',
            'description.required' => 'Please enter a project description.',
            'description.min' => 'The description must contain at least 10 characters.',
            'tech_stack.required' => 'Add at least one technology.',
            'tech_stack.min' => 'Add at least one technology.',
            'tech_stack.*.required' => 'Technology names cannot be empty.',
            'project_url.url' => 'Enter a valid project URL, including https://.',
            'repository_url.url' => 'Enter a valid repository URL, including https://.',
            'image.image' => 'The project image must be a valid image file.',
            'image.mimes' => 'The image must be a JPG, JPEG, PNG, or WEBP file.',
            'image.max' => 'The image must not be larger than 2 MB.',
            'date_completed.before_or_equal' => 'The completion date cannot be in the future.',
        ])->validate();
    }

    private function storeProjectImage(UploadedFile $image): string
    {
        $path = $image->storePublicly('projects', 'public');

        if (! is_string($path)) {
            throw new RuntimeException('The project image could not be stored.');
        }

        return $path;
    }

    private function deleteProjectImage(string $path): void
    {
        if (! str_starts_with($path, 'projects/')) {
            return;
        }

        if (! Storage::disk('public')->delete($path)) {
            throw new RuntimeException("The stored project image [{$path}] could not be deleted.");
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function presentProject(Project $project): array
    {
        return [
            'id' => $project->id,
            'title' => $project->title,
            'description' => $project->description,
            'tech_stack' => $project->tech_stack,
            'project_url' => $project->project_url,
            'repository_url' => $project->repository_url,
            'image' => $project->image,
            'image_url' => $project->image
                ? '/storage/'.$project->image
                : null,
            'date_completed' => $project->date_completed?->format('Y-m-d'),
        ];
    }
}
