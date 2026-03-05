<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EncomendaEditora extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'encomendas_editora';

    protected $fillable = [
        'editora_id',
        'status',
        'data_solicitada',
    ];

    protected $casts = [
        'data_solicitada' => 'datetime',
    ];

    public function editora(): BelongsTo
    {
        return $this->belongsTo(Editora::class);
    }

    public function itens(): HasMany
    {
        return $this->hasMany(EncomendaLivroEditoraItem::class);
    }

    public function rececoes(): HasMany
    {
        return $this->hasMany(RececaoEditora::class);
    }
}
