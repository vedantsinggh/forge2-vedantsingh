<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Ticket;

class ActivityLogService
{
    public function log(Ticket $ticket, string $action, ?array $changes = null): ActivityLog
    {
        return ActivityLog::create([
            'organization_id' => $ticket->organization_id,
            'ticket_id' => $ticket->id,
            'user_id' => auth()->id(),
            'action' => $action,
            'changes' => $changes,
        ]);
    }
}
