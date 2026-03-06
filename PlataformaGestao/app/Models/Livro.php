<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Livro extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'livros';

    protected $fillable = [
        'editora_id',
        'disciplina_id',
        'ano_escolar_id',
        'livro_relacionado_id',
        'tipo',
        'titulo',
        'isbn',
        'codigo_interno',
        'preco',
        'ativo',
        'status_alerta',
    ];

    protected $casts = [
        'preco' => 'decimal:2',
        'ativo' => 'boolean',
    ];

    /**
     * Mutator para o campo tipo
     * Converte para maiúsculas para garantir consistência com a base de dados
     */
    public function setTipoAttribute($value)
    {
        $this->attributes['tipo'] = strtoupper($value);
    }

    /**
     * Accessor para o campo tipo
     * Retorna em minúsculas para consistência com o frontend
     */
    public function getTipoAttribute($value)
    {
        return strtolower($value);
    }

    public function editora(): BelongsTo
    {
        return $this->belongsTo(Editora::class);
    }

    public function disciplina(): BelongsTo
    {
        return $this->belongsTo(Disciplina::class);
    }

    public function anoEscolar(): BelongsTo
    {
        return $this->belongsTo(AnoEscolar::class);
    }

    public function stock(): HasOne
    {
        return $this->hasOne(Stock::class);
    }

    public function stockMovimentos(): HasMany
    {
        return $this->hasMany(StockMovimento::class);
    }

    public function encomendaLivroEditoraItens(): HasMany
    {
        return $this->hasMany(EncomendaLivroEditoraItem::class);
    }

    public function encomendaLivroAlunoItens(): HasMany
    {
        return $this->hasMany(EncomendaLivroAlunoItem::class);
    }

    public function rececaoLivroItens(): HasMany
    {
        return $this->hasMany(RececaoLivroItem::class);
    }

    public function alocacoesStock(): HasMany
    {
        return $this->hasMany(AlocacaoStock::class);
    }

    /**
     * Livro relacionado (ex: manual relacionado com caderno de atividades)
     */
    public function livroRelacionado(): BelongsTo
    {
        return $this->belongsTo(Livro::class, 'livro_relacionado_id');
    }
}
