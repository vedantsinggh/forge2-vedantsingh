<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\Ticket;
use App\Models\User;

class CommentPolicy
{
    public function viewAny(User $user, Ticket $ticket): bool
    {
        return $user->can('view', $ticket);
    }

    public function create(User $user, Ticket $ticket): bool
    {
        return $user->can('view', $ticket);
    }
}
