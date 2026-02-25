<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Editora extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'editoras';

    protected $fillable = [
        'nome',
        'contacto_email',
        'contacto_telefone',
    ];

    public function livros(): HasMany
    {
        return $this->hasMany(Livro::class);
    }

    public function encomendasEditora(): HasMany
    {
        return $this->hasMany(EncomendaEditora::class);
    }
}
