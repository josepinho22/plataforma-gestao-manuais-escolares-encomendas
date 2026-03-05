<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Escola extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'escolas';

    protected $fillable = [
        'concelho_id',
        'nome',
        'codigo',
        'isAtivo',
    ];

    protected $casts = [
        'isAtivo' => 'boolean',
    ];

    public function concelho(): BelongsTo
    {
        return $this->belongsTo(Concelho::class);
    }

    public function listasLivros(): HasMany
    {
        return $this->hasMany(ListaLivro::class);
    }

    public function encomendasAluno(): HasMany
    {
        return $this->hasMany(EncomendaAluno::class);
    }
}
