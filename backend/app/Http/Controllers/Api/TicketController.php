<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTicketRequest;
use App\Http\Requests\UpdateTicketRequest;
use App\Models\Ticket;
use App\Services\TicketService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function __construct(protected TicketService $ticketService) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Ticket::with(['customer', 'assignedAgent', 'organization']);

        // Customer can only see their own tickets
        if ($user->isCustomer()) {
            $query->where('customer_id', $user->id);
        }

        // Filtering
        if ($request->filled('status')) {
            $status = ucfirst(str_replace('_', ' ', $request->status));
            $query->where('status', $status);
        }

        if ($request->filled('priority')) {
            $priority = ucfirst(strtolower($request->priority));
            $query->where('priority', $priority);
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('assigned_agent_id')) {
            $query->where('assigned_agent_id', $request->assigned_agent_id);
        }

        if ($request->filled('assigned_to_me') && $request->boolean('assigned_to_me')) {
            $query->where('assigned_agent_id', $user->id);
        }

        if ($request->filled('created_from')) {
            $query->whereDate('created_at', '>=', $request->created_from);
        }

        if ($request->filled('created_to')) {
            $query->whereDate('created_at', '<=', $request->created_to);
        }

        // Search
        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(function ($sub) use ($q) {
                $sub->where('ticket_number', 'like', "%{$q}%")
                    ->orWhere('title', 'like', "%{$q}%")
                    ->orWhere('subject', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%");
            });
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $allowedSorts = ['created_at', 'updated_at', 'priority', 'status', 'sla_due_at'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        } else {
            $query->latest();
        }

        $tickets = $query->paginate($request->input('per_page', 15));

        return response()->json($tickets);
    }

    public function store(StoreTicketRequest $request): JsonResponse
    {
        $ticket = $this->ticketService->createTicket(
            $request->validated(),
            $request->user()->id
        );

        return response()->json($ticket->load(['customer', 'assignedAgent']), 201);
    }

    public function show(Request $request, Ticket $ticket): JsonResponse
    {
        $this->authorize('view', $ticket);

        return response()->json(
            $ticket->load(['customer', 'assignedAgent', 'comments.user', 'internalNotes.user', 'activityLogs.user'])
        );
    }

    public function update(UpdateTicketRequest $request, Ticket $ticket): JsonResponse
    {
        $this->authorize('update', $ticket);

        $updated = $this->ticketService->updateTicket($ticket, $request->validated());

        return response()->json($updated->load(['customer', 'assignedAgent']));
    }

    public function destroy(Request $request, Ticket $ticket): JsonResponse
    {
        $this->authorize('delete', $ticket);

        $ticket->delete();

        return response()->json(['message' => 'Ticket deleted successfully']);
    }
}
