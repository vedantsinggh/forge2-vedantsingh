<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInternalNoteRequest;
use App\Models\InternalNote;
use App\Models\Ticket;
use App\Services\ActivityLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InternalNoteController extends Controller
{
    public function __construct(protected ActivityLogService $activityLogService) {}

    public function index(Request $request, Ticket $ticket): JsonResponse
    {
        $this->authorize('viewAny', [InternalNote::class, $ticket]);

        $notes = $ticket->internalNotes()->with('user')->latest()->get();

        return response()->json($notes);
    }

    public function store(StoreInternalNoteRequest $request, Ticket $ticket): JsonResponse
    {
        $this->authorize('create', [InternalNote::class, $ticket]);

        $note = InternalNote::create([
            'organization_id' => $ticket->organization_id,
            'ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
            'body' => $request->validated()['body'],
        ]);

        $this->activityLogService->log($ticket, 'Internal Note Added');

        return response()->json($note->load('user'), 201);
    }
}
