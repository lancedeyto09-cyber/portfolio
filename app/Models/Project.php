<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'title',
        'description',
        'tech_stack',
        'project_url',
        'repository_url',
        'image',
        'date_completed',
    ];

    protected function casts(): array
    {
        return [
            'tech_stack' => 'array',
            'date_completed' => 'date',
        ];
    }
}
