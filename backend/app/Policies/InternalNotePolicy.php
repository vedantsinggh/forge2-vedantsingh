<?php

namespace App\Policies;

use App\Models\Ticket;
use App\Models\User;

class InternalNotePolicy
{
    public function viewAny(User $user, Ticket $ticket): bool
    {
        if ($user->organization_id !== $ticket->organization_id) {
            return false;
        }

        return $user->isAdmin() || $user->isAgent();
    }

    public function create(User $user, Ticket $ticket): bool
    {
        if ($user->organization_id !== $ticket->organization_id) {
            return false;
        }

        return $user->isAdmin() || $user->isAgent();
    }
}
