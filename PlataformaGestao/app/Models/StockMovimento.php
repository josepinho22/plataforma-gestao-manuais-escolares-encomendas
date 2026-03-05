<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockMovimento extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'stock_movimentos';

    protected $fillable = [
        'livro_id',
        'tipo',
        'quantidade',
        'observacao',
    ];

    protected $casts = [
        'tipo' => 'integer',
        'quantidade' => 'integer',
    ];

    public function livro(): BelongsTo
    {
        return $this->belongsTo(Livro::class);
    }
}
