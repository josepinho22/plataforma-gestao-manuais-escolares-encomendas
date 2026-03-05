<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AnoEscolar extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'anos_escolares';

    protected $fillable = [
        'name',
    ];

    public function livros(): HasMany
    {
        return $this->hasMany(Livro::class);
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
