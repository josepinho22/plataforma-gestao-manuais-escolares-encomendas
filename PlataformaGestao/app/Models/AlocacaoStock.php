<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AlocacaoStock extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'alocacoes_stock';

    protected $fillable = [
        'livro_id',
        'rececao_editora_item_id',
        'encomenda_aluno_item_id',
        'quantidade_alocada',
    ];

    protected $casts = [
        'quantidade_alocada' => 'integer',
    ];

    public function livro(): BelongsTo
    {
        return $this->belongsTo(Livro::class);
    }

    public function rececaoEditoraItem(): BelongsTo
    {
        return $this->belongsTo(RececaoLivroItem::class, 'rececao_editora_item_id');
    }

    public function encomendaAlunoItem(): BelongsTo
    {
        return $this->belongsTo(EncomendaLivroAlunoItem::class, 'encomenda_aluno_item_id');
    }
}
