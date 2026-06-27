<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, User $targetUser): bool
    {
        if ($user->organization_id !== $targetUser->organization_id) {
            return false;
        }

        return $user->isAdmin() || $user->id === $targetUser->id;
    }

    public function delete(User $user, User $targetUser): bool
    {
        if ($user->organization_id !== $targetUser->organization_id) {
            return false;
        }

        return $user->isAdmin() && $user->id !== $targetUser->id;
    }
}
