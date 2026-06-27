<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['nullable', 'string', 'max:255'],
            'subject' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', 'string', 'in:Open,In Progress,Pending,Resolved,Closed,open,in_progress,pending,resolved,closed'],
            'priority' => ['nullable', 'string', 'in:Low,Medium,High,Critical,low,medium,high,critical'],
            'category' => ['nullable', 'string', 'max:100'],
            'assigned_agent_id' => ['nullable', 'exists:users,id'],
        ];
    }
}
