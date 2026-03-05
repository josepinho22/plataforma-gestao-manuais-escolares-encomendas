<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Aluno extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'alunos';

    protected $fillable = [
        'nif',
        'id_mega',
        'nome',
        'telefone',
        'email',
        'numero_cliente',
    ];

    public function encomendas(): HasMany
    {
        return $this->hasMany(EncomendaAluno::class);
    }
}
