<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Concelho extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'concelhos';

    protected $fillable = [
        'nome',
    ];

    public function escolas(): HasMany
    {
        return $this->hasMany(Escola::class);
    }
}
