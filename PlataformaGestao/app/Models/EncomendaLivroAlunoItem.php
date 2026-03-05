<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EncomendaLivroAlunoItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'encomenda_livro_aluno_itens';

    protected $fillable = [
        'encomenda_aluno_id',
        'livro_id',
        'quantidade',
        'encapar',
        'encapado',
        'quantidade_entregue',
        'entregue',
        'ensacado',
    ];

    protected $casts = [
        'quantidade' => 'integer',
        'encapar' => 'boolean',
        'encapado' => 'boolean',
        'quantidade_entregue' => 'integer',
        'entregue' => 'boolean',
        'ensacado' => 'boolean',
    ];

    public function encomendaAluno(): BelongsTo
    {
        return $this->belongsTo(EncomendaAluno::class);
    }

    public function livro(): BelongsTo
    {
        return $this->belongsTo(Livro::class);
    }

    public function alocacoesStock(): HasMany
    {
        return $this->hasMany(AlocacaoStock::class, 'encomenda_aluno_item_id');
    }
}
