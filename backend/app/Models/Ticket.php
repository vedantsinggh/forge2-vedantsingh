<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToOrganization;

class Ticket extends Model
{
    use HasFactory, BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'customer_id',
        'assigned_agent_id',
        'ticket_number',
        'title',
        'subject',
        'description',
        'status',
        'priority',
        'category',
        'sla_due_at',
        'sla_breached',
    ];

    protected $casts = [
        'sla_due_at' => 'datetime',
        'sla_breached' => 'boolean',
    ];

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function requester()
    {
        return $this->customer();
    }

    public function assignedAgent()
    {
        return $this->belongsTo(User::class, 'assigned_agent_id');
    }

    public function assignee()
    {
        return $this->assignedAgent();
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function internalNotes()
    {
        return $this->hasMany(InternalNote::class);
    }

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class);
    }

    public function getTitleAttribute($value)
    {
        return $value ?? $this->attributes['subject'] ?? null;
    }

    public function getSubjectAttribute($value)
    {
        return $value ?? $this->attributes['title'] ?? null;
    }

    public function setTitleAttribute($value)
    {
        $this->attributes['title'] = $value;
        $this->attributes['subject'] = $value;
    }

    public function setSubjectAttribute($value)
    {
        $this->attributes['subject'] = $value;
        $this->attributes['title'] = $value;
    }
}
