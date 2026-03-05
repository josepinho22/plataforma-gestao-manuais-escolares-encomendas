<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ListaLivroItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'lista_livro_itens';

    protected $fillable = [
        'lista_id',
        'disciplina_id',
        'manual_livro_id',
        'caderno_livro_id',
    ];

    public function lista(): BelongsTo
    {
        return $this->belongsTo(ListaLivro::class, 'lista_id');
    }

    public function disciplina(): BelongsTo
    {
        return $this->belongsTo(Disciplina::class);
    }

    public function manualLivro(): BelongsTo
    {
        return $this->belongsTo(Livro::class, 'manual_livro_id');
    }

    public function cadernoLivro(): BelongsTo
    {
        return $this->belongsTo(Livro::class, 'caderno_livro_id');
    }
}
