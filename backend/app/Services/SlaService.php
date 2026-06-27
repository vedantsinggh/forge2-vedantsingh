<?php

namespace App\Services;

use App\Models\Ticket;
use Carbon\Carbon;

class SlaService
{
    public function calculateDueDate(string $priority): Carbon
    {
        $now = Carbon::now();

        return match (strtolower($priority)) {
            'critical', 'urgent' => $now->addHours(1),
            'high' => $now->addHours(4),
            'medium' => $now->addHours(8),
            'low' => $now->addHours(24),
            default => $now->addHours(8),
        };
    }

    public function checkBreaches(): int
    {
        $breachedTickets = Ticket::where('sla_breached', false)
            ->whereNotIn('status', ['Resolved', 'Closed'])
            ->where('sla_due_at', '<', Carbon::now())
            ->get();

        $count = 0;
        foreach ($breachedTickets as $ticket) {
            $ticket->update(['sla_breached' => true]);
            $count++;
        }

        return $count;
    }
}
