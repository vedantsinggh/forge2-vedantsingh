<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Organization;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentFactory extends Factory
{
    protected $model = Comment::class;

    public function definition(): array
    {
        $content = $this->faker->paragraph();
        return [
            'organization_id' => Organization::factory(),
            'ticket_id' => Ticket::factory(),
            'user_id' => User::factory(),
            'content' => $content,
            'body' => $content,
        ];
    }
}
