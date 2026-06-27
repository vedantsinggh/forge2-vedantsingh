<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentRequest;
use App\Models\Comment;
use App\Models\Ticket;
use App\Services\ActivityLogService;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function __construct(
        protected ActivityLogService $activityLogService,
        protected NotificationService $notificationService
    ) {}

    public function index(Request $request, Ticket $ticket): JsonResponse
    {
        $this->authorize('view', $ticket);

        $comments = $ticket->comments()->with('user')->oldest()->get();

        return response()->json($comments);
    }

    public function store(StoreCommentRequest $request, Ticket $ticket): JsonResponse
    {
        $this->authorize('view', $ticket);

        $validated = $request->validated();
        $content = $validated['content'] ?? $validated['body'] ?? '';

        if (empty(trim($content))) {
            return response()->json(['message' => 'Comment body cannot be empty'], 422);
        }

        $comment = Comment::create([
            'organization_id' => $ticket->organization_id,
            'ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
            'content' => $content,
            'body' => $content,
        ]);

        $this->activityLogService->log($ticket, 'Comment Added');
        $this->notificationService->notifyComment($ticket, $request->user()->id);

        return response()->json($comment->load('user'), 201);
    }
}
