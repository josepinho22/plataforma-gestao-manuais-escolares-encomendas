<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ListaLivro extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'listas_livros';

    protected $fillable = [
        'escola_id',
        'ano_letivo_id',
        'ano_escolar_id',
    ];

    public function escola(): BelongsTo
    {
        return $this->belongsTo(Escola::class);
    }

    public function anoLetivo(): BelongsTo
    {
        return $this->belongsTo(AnoLetivo::class);
    }

    public function anoEscolar(): BelongsTo
    {
        return $this->belongsTo(AnoEscolar::class);
    }

    public function itens(): HasMany
    {
        return $this->hasMany(ListaLivroItem::class, 'lista_id');
    }

    public function encomendasAluno(): HasMany
    {
        return $this->hasMany(EncomendaAluno::class, 'lista_id');
    }
}
