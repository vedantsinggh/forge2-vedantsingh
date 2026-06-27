<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $q = $request->input('q', '');
        if (empty(trim($q))) {
            return response()->json([
                'tickets' => [],
                'comments' => [],
                'users' => [],
            ]);
        }

        $user = $request->user();

        // Tickets search
        $ticketQuery = Ticket::with(['customer', 'assignedAgent']);
        if ($user->isCustomer()) {
            $ticketQuery->where('customer_id', $user->id);
        }
        $tickets = $ticketQuery->where(function ($sub) use ($q) {
            $sub->where('ticket_number', 'like', "%{$q}%")
                ->orWhere('title', 'like', "%{$q}%")
                ->orWhere('subject', 'like', "%{$q}%")
                ->orWhere('description', 'like', "%{$q}%");
        })->take(10)->get();

        // Comments search
        $commentQuery = Comment::with(['ticket', 'user']);
        if ($user->isCustomer()) {
            $commentQuery->whereHas('ticket', function ($t) use ($user) {
                $t->where('customer_id', $user->id);
            });
        }
        $comments = $commentQuery->where(function ($sub) use ($q) {
            $sub->where('content', 'like', "%{$q}%")
                ->orWhere('body', 'like', "%{$q}%");
        })->take(10)->get();

        // Users search (for agents and admins)
        $users = [];
        if (!$user->isCustomer()) {
            $users = User::where('name', 'like', "%{$q}%")
                ->orWhere('email', 'like', "%{$q}%")
                ->take(10)->get();
        }

        return response()->json([
            'tickets' => $tickets,
            'comments' => $comments,
            'users' => $users,
        ]);
    }
}
