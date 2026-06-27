<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\Comment;
use App\Models\InternalNote;
use App\Models\Notification;
use App\Models\Organization;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Primary Organization
        $acme = Organization::create([
            'name' => 'Acme Global Corp',
            'slug' => 'acme-global',
        ]);

        // Primary Users
        $admin = User::create([
            'organization_id' => $acme->id,
            'name' => 'Alex Administrator',
            'email' => 'admin@pulsedesk.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $agent = User::create([
            'organization_id' => $acme->id,
            'name' => 'Sarah Agent',
            'email' => 'agent@pulsedesk.com',
            'password' => Hash::make('password'),
            'role' => 'agent',
        ]);

        $customer = User::create([
            'organization_id' => $acme->id,
            'name' => 'John Customer',
            'email' => 'customer@pulsedesk.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
        ]);

        // Additional Users
        $agent2 = User::create([
            'organization_id' => $acme->id,
            'name' => 'Marcus Vance',
            'email' => 'marcus@pulsedesk.com',
            'password' => Hash::make('password'),
            'role' => 'agent',
        ]);

        $customer2 = User::create([
            'organization_id' => $acme->id,
            'name' => 'Emma Watson',
            'email' => 'emma@pulsedesk.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
        ]);

        // 2. Second Tenant Organization for isolation verification
        $techCorp = Organization::create([
            'name' => 'TechCorp Solutions',
            'slug' => 'techcorp-solutions',
        ]);

        $otherAdmin = User::create([
            'organization_id' => $techCorp->id,
            'name' => 'Other Tenant Admin',
            'email' => 'admin@techcorp.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        $otherCustomer = User::create([
            'organization_id' => $techCorp->id,
            'name' => 'TechCorp Client',
            'email' => 'client@techcorp.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
        ]);

        // 3. Create Demo Tickets for Acme
        $ticket1 = Ticket::create([
            'organization_id' => $acme->id,
            'customer_id' => $customer->id,
            'assigned_agent_id' => $agent->id,
            'ticket_number' => 'INC-100492',
            'title' => 'Cannot download monthly tax invoice PDF from billing tab',
            'subject' => 'Cannot download monthly tax invoice PDF from billing tab',
            'description' => 'Whenever I click on the Download PDF button under the Billing history tab, the page hangs and eventually shows HTTP 500 error. Please investigate.',
            'status' => 'In Progress',
            'priority' => 'High',
            'category' => 'Billing',
            'sla_due_at' => now()->addHours(3),
            'sla_breached' => false,
        ]);

        $ticket2 = Ticket::create([
            'organization_id' => $acme->id,
            'customer_id' => $customer->id,
            'assigned_agent_id' => $agent2->id,
            'ticket_number' => 'INC-100493',
            'title' => 'SSO Integration with Okta failing with SAML response mismatch',
            'subject' => 'SSO Integration with Okta failing with SAML response mismatch',
            'description' => 'Our security team configured Okta SAML v2.0, but during login redirection we get invalid signature errors.',
            'status' => 'Open',
            'priority' => 'Critical',
            'category' => 'Technical',
            'sla_due_at' => now()->subMinutes(30),
            'sla_breached' => true,
        ]);

        $ticket3 = Ticket::create([
            'organization_id' => $acme->id,
            'customer_id' => $customer2->id,
            'assigned_agent_id' => $agent->id,
            'ticket_number' => 'INC-100494',
            'title' => 'Request to increase API rate limit for webhook ingestion',
            'subject' => 'Request to increase API rate limit for webhook ingestion',
            'description' => 'We are scaling our production ingestion pipeline and hitting the 60 req/min rate limit during peak load spikes.',
            'status' => 'Pending',
            'priority' => 'Medium',
            'category' => 'Feature Request',
            'sla_due_at' => now()->addHours(12),
            'sla_breached' => false,
        ]);

        $ticket4 = Ticket::create([
            'organization_id' => $acme->id,
            'customer_id' => $customer2->id,
            'assigned_agent_id' => $agent->id,
            'ticket_number' => 'INC-100495',
            'title' => 'Password reset email link expired immediately',
            'subject' => 'Password reset email link expired immediately',
            'description' => 'When clicking the password reset button in the email, it says token expired. Had to request 3 times.',
            'status' => 'Resolved',
            'priority' => 'Low',
            'category' => 'General',
            'sla_due_at' => now()->addHours(20),
            'sla_breached' => false,
        ]);

        // 4. Create Comments & Internal Notes
        Comment::create([
            'organization_id' => $acme->id,
            'ticket_id' => $ticket1->id,
            'user_id' => $agent->id,
            'content' => 'Hi John, thanks for reaching out. We have reproduced the issue on our staging server and engineers are applying a patch right now.',
            'body' => 'Hi John, thanks for reaching out. We have reproduced the issue on our staging server and engineers are applying a patch right now.',
        ]);

        Comment::create([
            'organization_id' => $acme->id,
            'ticket_id' => $ticket1->id,
            'user_id' => $customer->id,
            'content' => 'Thanks Sarah! Appreciate the quick update. Will wait for the confirmation.',
            'body' => 'Thanks Sarah! Appreciate the quick update. Will wait for the confirmation.',
        ]);

        InternalNote::create([
            'organization_id' => $acme->id,
            'ticket_id' => $ticket1->id,
            'user_id' => $agent->id,
            'body' => 'Internal Note: PDF generator phantomjs process crashed due to memory limit on AWS ECS task. Devops scaling memory allocation.',
        ]);

        // 5. Activity Logs & Notifications
        ActivityLog::create([
            'organization_id' => $acme->id,
            'ticket_id' => $ticket1->id,
            'user_id' => $customer->id,
            'action' => 'Ticket Created',
        ]);

        ActivityLog::create([
            'organization_id' => $acme->id,
            'ticket_id' => $ticket1->id,
            'user_id' => $admin->id,
            'action' => 'Assigned Agent Changed',
            'changes' => ['from' => null, 'to' => $agent->id],
        ]);

        Notification::create([
            'organization_id' => $acme->id,
            'user_id' => $agent->id,
            'ticket_id' => $ticket1->id,
            'title' => 'Ticket Assigned',
            'message' => 'You have been assigned to ticket #INC-100492',
            'type' => 'assignment',
        ]);

        // TechCorp ticket for isolation test
        Ticket::create([
            'organization_id' => $techCorp->id,
            'customer_id' => $otherCustomer->id,
            'assigned_agent_id' => null,
            'ticket_number' => 'INC-999001',
            'title' => 'TechCorp confidential ticket - should never leak to Acme',
            'subject' => 'TechCorp confidential ticket - should never leak to Acme',
            'description' => 'Confidential data for TechCorp organization.',
            'status' => 'Open',
            'priority' => 'High',
            'category' => 'General',
            'sla_due_at' => now()->addHours(5),
            'sla_breached' => false,
        ]);
    }
}
