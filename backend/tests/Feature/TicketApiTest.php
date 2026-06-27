<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_and_update_ticket()
    {
        $org = Organization::factory()->create();
        $user = User::factory()->create(['organization_id' => $org->id, 'role' => 'customer']);

        $createResponse = $this->actingAs($user)->postJson('/api/v1/tickets', [
            'title' => 'Broken checkout button',
            'description' => 'Checkout button does not respond to clicks',
            'priority' => 'High',
        ]);

        $createResponse->assertStatus(201)
            ->assertJsonPath('title', 'Broken checkout button');

        $ticketId = $createResponse->json('id');

        $agent = User::factory()->create(['organization_id' => $org->id, 'role' => 'agent']);

        $updateResponse = $this->actingAs($agent)->putJson("/api/v1/tickets/{$ticketId}", [
            'status' => 'In Progress',
            'assigned_agent_id' => $agent->id,
        ]);

        $updateResponse->assertStatus(200)
            ->assertJsonPath('status', 'In Progress');
    }
}
