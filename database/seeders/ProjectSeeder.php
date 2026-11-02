<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $projects = [
            [
                'title' => 'KKopiConnect',
                'description' => 'A school project for a coffee and milk tea franchise. It includes a Flutter ordering application and a web-based sales and inventory management system.',
                'tech_stack' => ['Flutter', 'Laravel/PHP', 'Firebase'],
            ],
            [
                'title' => 'FiveCETrack',
                'description' => 'A web-based fuel monitoring and sales management system designed to manage fuel inventory, stock movements, and transaction records.',
                'tech_stack' => ['Laravel', 'PHP', 'MySQL'],
            ],
            [
                'title' => 'Personal Portfolio',
                'description' => 'A responsive personal portfolio website developed to showcase my background, technical skills, and projects.',
                'tech_stack' => ['Laravel', 'React', 'Inertia.js', 'Tailwind CSS'],
            ],
        ];

        foreach ($projects as $project) {
            Project::query()->firstOrCreate(
                ['title' => $project['title']],
                $project
            );
        }
    }
}
