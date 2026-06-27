<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $baseQuery = Ticket::query();

        if ($user->isCustomer()) {
            $baseQuery->where('customer_id', $user->id);
        }

        // Open tickets count
        $openTicketsCount = (clone $baseQuery)->whereIn('status', ['Open', 'In Progress', 'Pending'])->count();

        // Tickets by status
        $ticketsByStatus = (clone $baseQuery)
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        // Tickets by priority
        $ticketsByPriority = (clone $baseQuery)
            ->select('priority', DB::raw('count(*) as total'))
            ->groupBy('priority')
            ->pluck('total', 'priority');

        // Recently updated tickets
        $recentlyUpdated = (clone $baseQuery)
            ->with(['customer', 'assignedAgent'])
            ->latest('updated_at')
            ->take(5)
            ->get();

        // Assigned tickets (to current user if agent/admin, or customer's tickets)
        $assignedTicketsCount = $user->isCustomer()
            ? $openTicketsCount
            : (clone $baseQuery)->where('assigned_agent_id', $user->id)->whereIn('status', ['Open', 'In Progress', 'Pending'])->count();

        // SLA warnings (due within 4 hours or breached)
        $slaWarningsCount = (clone $baseQuery)
            ->whereNotIn('status', ['Resolved', 'Closed'])
            ->where(function ($q) {
                $q->where('sla_breached', true)
                  ->orWhere('sla_due_at', '<=', Carbon::now()->addHours(4));
            })->count();

        $slaWarningsList = (clone $baseQuery)
            ->with(['customer', 'assignedAgent'])
            ->whereNotIn('status', ['Resolved', 'Closed'])
            ->where(function ($q) {
                $q->where('sla_breached', true)
                  ->orWhere('sla_due_at', '<=', Carbon::now()->addHours(4));
            })
            ->orderBy('sla_due_at', 'asc')
            ->take(5)
            ->get();

        return response()->json([
            'metrics' => [
                'open_tickets' => $openTicketsCount,
                'assigned_tickets' => $assignedTicketsCount,
                'sla_warnings' => $slaWarningsCount,
                'total_tickets' => (clone $baseQuery)->count(),
            ],
            'by_status' => [
                'Open' => $ticketsByStatus['Open'] ?? 0,
                'In Progress' => $ticketsByStatus['In Progress'] ?? 0,
                'Pending' => $ticketsByStatus['Pending'] ?? 0,
                'Resolved' => $ticketsByStatus['Resolved'] ?? 0,
                'Closed' => $ticketsByStatus['Closed'] ?? 0,
            ],
            'by_priority' => [
                'Low' => $ticketsByPriority['Low'] ?? 0,
                'Medium' => $ticketsByPriority['Medium'] ?? 0,
                'High' => $ticketsByPriority['High'] ?? 0,
                'Critical' => $ticketsByPriority['Critical'] ?? 0,
            ],
            'recently_updated' => $recentlyUpdated,
            'sla_warnings' => $slaWarningsList,
        ]);
    }
}
