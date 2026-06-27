<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToOrganization;

class Comment extends Model
{
    use HasFactory, BelongsToOrganization;

    protected $fillable = [
        'organization_id',
        'ticket_id',
        'user_id',
        'content',
        'body',
    ];

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getBodyAttribute($value)
    {
        return $value ?? $this->attributes['content'] ?? null;
    }

    public function getContentAttribute($value)
    {
        return $value ?? $this->attributes['body'] ?? null;
    }
}
