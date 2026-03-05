<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AnoLetivo extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'anos_letivos';

    protected $fillable = [
        'nome',
        'data_inicio',
        'data_fim',
    ];

    protected $casts = [
        'data_inicio' => 'date',
        'data_fim' => 'date',
    ];

    public function listasLivros(): HasMany
    {
        return $this->hasMany(ListaLivro::class);
    }

    public function encomendasAluno(): HasMany
    {
        return $this->hasMany(EncomendaAluno::class);
    }
}
