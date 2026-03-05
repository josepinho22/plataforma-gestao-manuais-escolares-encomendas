<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RececaoEditora extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'rececoes_editora';

    protected $fillable = [
        'encomenda_editora_id',
        'data_rececao',
    ];

    protected $casts = [
        'data_rececao' => 'datetime',
    ];

    public function encomendaEditora(): BelongsTo
    {
        return $this->belongsTo(EncomendaEditora::class);
    }

    public function itens(): HasMany
    {
        return $this->hasMany(RececaoLivroItem::class);
    }
}
