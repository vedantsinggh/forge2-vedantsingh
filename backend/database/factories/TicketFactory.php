<?php

namespace Database\Factories;

use App\Models\Organization;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TicketFactory extends Factory
{
    protected $model = Ticket::class;

    public function definition(): array
    {
        $subject = $this->faker->sentence(6);
        return [
            'organization_id' => Organization::factory(),
            'customer_id' => User::factory()->customer(),
            'assigned_agent_id' => User::factory()->agent(),
            'ticket_number' => 'INC-' . strtoupper(Str::random(6)),
            'title' => $subject,
            'subject' => $subject,
            'description' => $this->faker->paragraph(3),
            'status' => $this->faker->randomElement(['Open', 'In Progress', 'Pending', 'Resolved', 'Closed']),
            'priority' => $this->faker->randomElement(['Low', 'Medium', 'High', 'Critical']),
            'category' => $this->faker->randomElement(['Billing', 'Technical', 'Feature Request', 'General']),
            'sla_due_at' => now()->addHours(rand(1, 48)),
            'sla_breached' => false,
        ];
    }
}
