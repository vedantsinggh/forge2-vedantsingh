<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TenantIsolationTest extends TestCase
{
    use RefreshDatabase;

    public function test_tenant_isolation_prevents_cross_organization_data_leakage()
    {
        $orgA = Organization::factory()->create(['name' => 'Org A']);
        $userA = User::factory()->create(['organization_id' => $orgA->id, 'role' => 'agent']);

        $orgB = Organization::factory()->create(['name' => 'Org B']);
        $userB = User::factory()->create(['organization_id' => $orgB->id, 'role' => 'agent']);

        // Create tickets for both orgs
        $ticketA = Ticket::factory()->create([
            'organization_id' => $orgA->id,
            'customer_id' => User::factory()->create(['organization_id' => $orgA->id])->id,
            'title' => 'Ticket Org A Secret',
        ]);

        $ticketB = Ticket::factory()->create([
            'organization_id' => $orgB->id,
            'customer_id' => User::factory()->create(['organization_id' => $orgB->id])->id,
            'title' => 'Ticket Org B Secret',
        ]);

        // Acting as User A
        $responseA = $this->actingAs($userA)->getJson('/api/v1/tickets');
        $responseA->assertStatus(200);
        $ticketTitlesA = collect($responseA->json('data'))->pluck('title');

        $this->assertTrue($ticketTitlesA->contains('Ticket Org A Secret'));
        $this->assertFalse($ticketTitlesA->contains('Ticket Org B Secret'));

        // Acting as User A trying to directly fetch Ticket B
        $directResponse = $this->actingAs($userA)->getJson('/api/v1/tickets/' . $ticketB->id);
        // Scoped query will either return 404 or 403 authorization failed
        $this->assertTrue(in_array($directResponse->status(), [404, 403]));
    }
}
