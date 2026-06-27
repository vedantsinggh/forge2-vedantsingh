<?php

namespace Database\Factories;

use App\Models\InternalNote;
use App\Models\Organization;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class InternalNoteFactory extends Factory
{
    protected $model = InternalNote::class;

    public function definition(): array
    {
        return [
            'organization_id' => Organization::factory(),
            'ticket_id' => Ticket::factory(),
            'user_id' => User::factory()->agent(),
            'body' => $this->faker->paragraph(),
        ];
    }
}
