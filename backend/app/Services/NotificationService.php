<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\Ticket;

class NotificationService
{
    public function notifyUser(int $userId, Ticket $ticket, string $title, string $message, string $type): Notification
    {
        return Notification::create([
            'organization_id' => $ticket->organization_id,
            'user_id' => $userId,
            'ticket_id' => $ticket->id,
            'title' => $title,
            'message' => $message,
            'type' => $type,
        ]);
    }

    public function notifyAssignment(Ticket $ticket): void
    {
        if ($ticket->assigned_agent_id) {
            $this->notifyUser(
                $ticket->assigned_agent_id,
                $ticket,
                'Ticket Assigned',
                "You have been assigned to ticket #{$ticket->ticket_number}: {$ticket->title}",
                'assignment'
            );
        }
    }

    public function notifyStatusUpdate(Ticket $ticket, string $oldStatus): void
    {
        $message = "Ticket #{$ticket->ticket_number} status changed from {$oldStatus} to {$ticket->status}";
        
        // Notify customer
        if ($ticket->customer_id && $ticket->customer_id !== auth()->id()) {
            $this->notifyUser($ticket->customer_id, $ticket, 'Status Updated', $message, 'status_change');
        }

        // Notify agent
        if ($ticket->assigned_agent_id && $ticket->assigned_agent_id !== auth()->id()) {
            $this->notifyUser($ticket->assigned_agent_id, $ticket, 'Status Updated', $message, 'status_change');
        }
    }

    public function notifyComment(Ticket $ticket, int $authorId): void
    {
        $message = "New reply added on ticket #{$ticket->ticket_number}";

        if ($ticket->customer_id && $ticket->customer_id !== $authorId) {
            $this->notifyUser($ticket->customer_id, $ticket, 'New Comment', $message, 'new_comment');
        }

        if ($ticket->assigned_agent_id && $ticket->assigned_agent_id !== $authorId) {
            $this->notifyUser($ticket->assigned_agent_id, $ticket, 'New Comment', $message, 'new_comment');
        }
    }
}
