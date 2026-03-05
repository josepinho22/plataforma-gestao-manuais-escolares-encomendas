<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RececaoLivroItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'rececao_livro_itens';

    protected $fillable = [
        'rececao_editora_id',
        'encomenda_editora_item_id',
        'livro_id',
        'qtd_recebida',
    ];

    protected $casts = [
        'qtd_recebida' => 'integer',
    ];

    public function rececaoEditora(): BelongsTo
    {
        return $this->belongsTo(RececaoEditora::class);
    }

    public function encomendaEditoraItem(): BelongsTo
    {
        return $this->belongsTo(EncomendaLivroEditoraItem::class, 'encomenda_editora_item_id');
    }

    public function livro(): BelongsTo
    {
        return $this->belongsTo(Livro::class);
    }

    public function alocacoesStock(): HasMany
    {
        return $this->hasMany(AlocacaoStock::class, 'rececao_editora_item_id');
    }
}
