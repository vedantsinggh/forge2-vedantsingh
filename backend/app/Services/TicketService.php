<?php

namespace App\Services;

use App\Models\Ticket;
use Illuminate\Support\Str;

class TicketService
{
    public function __construct(
        protected SlaService $slaService,
        protected ActivityLogService $activityLogService,
        protected NotificationService $notificationService
    ) {}

    public function createTicket(array $data, int $customerId): Ticket
    {
        $ticketNumber = 'INC-' . strtoupper(Str::random(6));
        $priority = $data['priority'] ?? 'Medium';
        $slaDueAt = $this->slaService->calculateDueDate($priority);

        $ticket = Ticket::create([
            'organization_id' => auth()->user()->organization_id,
            'customer_id' => $customerId,
            'assigned_agent_id' => $data['assigned_agent_id'] ?? null,
            'ticket_number' => $ticketNumber,
            'title' => $data['title'] ?? $data['subject'] ?? 'No Subject',
            'subject' => $data['subject'] ?? $data['title'] ?? 'No Subject',
            'description' => $data['description'],
            'status' => $data['status'] ?? 'Open',
            'priority' => $priority,
            'category' => $data['category'] ?? 'General',
            'sla_due_at' => $slaDueAt,
            'sla_breached' => false,
        ]);

        $this->activityLogService->log($ticket, 'Ticket Created');

        if ($ticket->assigned_agent_id) {
            $this->notificationService->notifyAssignment($ticket);
        }

        return $ticket;
    }

    public function updateTicket(Ticket $ticket, array $data): Ticket
    {
        $oldStatus = $ticket->status;
        $oldAgent = $ticket->assigned_agent_id;

        if (isset($data['priority']) && $data['priority'] !== $ticket->priority) {
            $data['sla_due_at'] = $this->slaService->calculateDueDate($data['priority']);
        }

        $ticket->update($data);

        $changes = [];
        if (isset($data['status']) && $data['status'] !== $oldStatus) {
            $changes['status'] = ['from' => $oldStatus, 'to' => $data['status']];
            $this->activityLogService->log($ticket, 'Status Changed', $changes['status']);
            $this->notificationService->notifyStatusUpdate($ticket, $oldStatus);
        }

        if (array_key_exists('assigned_agent_id', $data) && $data['assigned_agent_id'] != $oldAgent) {
            $changes['assigned_agent_id'] = ['from' => $oldAgent, 'to' => $data['assigned_agent_id']];
            $this->activityLogService->log($ticket, 'Assigned Agent Changed', $changes['assigned_agent_id']);
            $this->notificationService->notifyAssignment($ticket);
        }

        if (empty($changes)) {
            $this->activityLogService->log($ticket, 'Ticket Updated', $data);
        }

        return $ticket->fresh();
    }
}
