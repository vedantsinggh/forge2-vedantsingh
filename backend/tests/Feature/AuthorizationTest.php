<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_cannot_access_internal_notes()
    {
        $org = Organization::factory()->create();
        $customer = User::factory()->create(['organization_id' => $org->id, 'role' => 'customer']);
        $ticket = Ticket::factory()->create([
            'organization_id' => $org->id,
            'customer_id' => $customer->id,
        ]);

        $response = $this->actingAs($customer)->getJson("/api/v1/tickets/{$ticket->id}/notes");
        $response->assertStatus(403);

        $postResponse = $this->actingAs($customer)->postJson("/api/v1/tickets/{$ticket->id}/notes", [
            'body' => 'Secret note try',
        ]);
        $postResponse->assertStatus(403);
    }
}
