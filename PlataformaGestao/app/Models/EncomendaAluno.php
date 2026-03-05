<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\AuditLog;

class EncomendaAluno extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'encomendas_aluno';

    protected $fillable = [
        'aluno_id',
        'nif',
        'id_mega',
        'nome',
        'telefone',
        'escola_id',
        'ano_letivo_id',
        'ano_escolar_id',
        'lista_id',
        'status',
        'observacao',
    ];

    public function aluno(): BelongsTo
    {
        return $this->belongsTo(Aluno::class);
    }

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

    public function lista(): BelongsTo
    {
        return $this->belongsTo(ListaLivro::class, 'lista_id');
    }

    public function itens(): HasMany
    {
        return $this->hasMany(EncomendaLivroAlunoItem::class);
    }

    /**
     * Recalcular e atualizar o status desta encomenda com base no estado dos itens e stock.
     */
    public function recalculateStatus(): ?string
    {
        $this->load(['itens.alocacoesStock', 'itens.livro.stock']);

        $newStatus = $this->calculateStatus();

        if ($newStatus !== $this->status) {
            $oldStatus = $this->status;
            $this->status = $newStatus;
            $this->save();

            AuditLog::create([
                'user_id' => auth()->id(),
                'entity_type' => 'EncomendaAluno',
                'entity_id' => $this->id,
                'action' => 'status_auto_updated',
                'changes' => [
                    'old_status' => $oldStatus,
                    'new_status' => $newStatus,
                    'reason' => self::getStatusChangeReason($newStatus),
                ],
                'created_at' => now(),
            ]);
        }

        return $this->status;
    }

    /**
     * Calcular o status correto com base no estado dos itens.
     */
    public function calculateStatus(): string
    {
        $itens = $this->itens;

        if ($itens->isEmpty()) {
            return 'AGUARDA_LIVROS';
        }

        // 1. Todos entregues?
        if ($itens->every(fn($item) => $item->entregue)) {
            return 'ENTREGUE';
        }

        // 2. Todos têm stock?
        $allHaveStock = $itens->every(function ($item) {
            if ($item->ensacado || $item->encapado || $item->entregue) {
                return true;
            }
            $totalAlocado = $item->alocacoesStock->sum('quantidade_alocada');
            if ($totalAlocado >= $item->quantidade) {
                return true;
            }
            $stockGeral = $item->livro?->stock?->quantidade ?? 0;
            return $stockGeral >= $item->quantidade;
        });

        if (!$allHaveStock) {
            return 'AGUARDA_LIVROS';
        }

        // 3. Todos ensacados?
        if (!$itens->every(fn($item) => $item->ensacado)) {
            return 'AGUARDA_ENSACAMENTO';
        }

        // 4. Todos os que precisam de encapar estão encapados?
        if (!$itens->every(fn($item) => !$item->encapar || $item->encapado)) {
            return 'AGUARDA_ENCAPAMENTO';
        }

        // 5. Tudo pronto
        return 'AGUARDA_LEVANTAMENTO';
    }

    /**
     * Recalcular status de todas as encomendas não-entregues que contêm um livro específico.
     */
    public static function recalculateForBook(int $livroId): void
    {
        $orders = static::where('status', '!=', 'ENTREGUE')
            ->whereHas('itens', function ($q) use ($livroId) {
                $q->where('livro_id', $livroId);
            })
            ->get();

        foreach ($orders as $order) {
            $order->recalculateStatus();
        }
    }

    public static function getStatusChangeReason(string $status): string
    {
        return match ($status) {
            'AGUARDA_LIVROS' => 'Nem todos os itens têm stock alocado',
            'AGUARDA_ENSACAMENTO' => 'Todos os livros têm stock, aguarda ensacamento',
            'AGUARDA_ENCAPAMENTO' => 'Todos ensacados, aguarda encapamento',
            'AGUARDA_LEVANTAMENTO' => 'Todos os itens processados, pronto para levantamento',
            'ENTREGUE' => 'Todos os itens foram entregues',
            default => 'Atualização automática de status',
        };
    }
}
