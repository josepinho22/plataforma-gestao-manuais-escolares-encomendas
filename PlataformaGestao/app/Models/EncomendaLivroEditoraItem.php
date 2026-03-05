<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EncomendaLivroEditoraItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'encomenda_livro_editora_itens';

    protected $fillable = [
        'encomenda_editora_id',
        'livro_id',
        'qtd_solicitada',
        'qtd_recebida_total',
    ];

    protected $casts = [
        'qtd_solicitada' => 'integer',
        'qtd_recebida_total' => 'integer',
    ];

    public function encomendaEditora(): BelongsTo
    {
        return $this->belongsTo(EncomendaEditora::class);
    }

    public function livro(): BelongsTo
    {
        return $this->belongsTo(Livro::class);
    }

    public function rececoesLivroItens(): HasMany
    {
        return $this->hasMany(RececaoLivroItem::class, 'encomenda_editora_item_id');
    }
}
