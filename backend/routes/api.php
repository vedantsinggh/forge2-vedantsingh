<?php

use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\InternalNoteController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\OrganizationController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public auth routes
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Protected API routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // Dashboard & Analytics
        Route::get('/dashboard', [DashboardController::class, 'index']);
        Route::get('/analytics/overview', [DashboardController::class, 'index']);

        // Global Search
        Route::get('/search', [SearchController::class, 'index']);

        // Tickets
        Route::apiResource('tickets', TicketController::class);

        // Ticket Comments & Notes
        Route::get('/tickets/{ticket}/comments', [CommentController::class, 'index']);
        Route::post('/tickets/{ticket}/comments', [CommentController::class, 'store']);
        Route::get('/tickets/{ticket}/notes', [InternalNoteController::class, 'index']);
        Route::post('/tickets/{ticket}/notes', [InternalNoteController::class, 'store']);
        Route::get('/tickets/{ticket}/activity', [ActivityLogController::class, 'index']);

        // Notifications
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

        // Users Management
        Route::apiResource('users', UserController::class);

        // Organization Settings
        Route::get('/organization', [OrganizationController::class, 'show']);
        Route::put('/organization', [OrganizationController::class, 'update']);
    });
});
