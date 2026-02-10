<?php

namespace App\Http\Controllers;

use App\Models\EncomendaEditora;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use App\Models\Stock;
use App\Models\StockMovimento;
use App\Models\EncomendaLivroEditoraItem;


class EncomendasEditoraController extends Controller
{
    public function index()
    {
        
        $stats = [
            'total' => EncomendaEditora::count(),
            'requested' => EncomendaEditora::where('status', 'SOLICITADO')->count(),
            'partial' => EncomendaEditora::where('status', 'ENTREGA_PARCIAL')->count(),
            'delivered' => EncomendaEditora::where('status', 'ENTREGA_COMPLETA')->count(),
        ];
        
        $ordersBase = EncomendaEditora::query()
            ->with(['editora', 'itens.livro']) 
            ->orderByDesc('id')
            ->get();

        $orders = $ordersBase->map(function ($o) {
            $lines = ($o->itens ?? collect())->map(function ($it) {
                return [
                    'id' => $it->id,
                    'title' => $it->livro?->titulo ?? '—',
                    'isbn' => $it->livro?->isbn ?? '—',
                    'qty_ordered' => (int) ($it->qtd_solicitada ?? 0),
                    'qty_received' => (int) ($it->qtd_recebida_total ?? 0),
                ];
            })->values();

            $total = ($o->itens ?? collect())->sum(function ($it) {
                $preco = (float) ($it->livro?->preco ?? 0);
                $qtd = (int) ($it->qtd_solicitada ?? 0);
                return $preco * $qtd;
            });

            return [
                'id' => $o->id,
                'number' => 'PO-' . now()->format('Y') . '-' . str_pad((string)$o->id, 3, '0', STR_PAD_LEFT),
                'publisher_name' => $o->editora?->nome ?? '—',
                'requested_at' => optional($o->data_solicitada)->format('d/m/Y') ?? '—',
                
                'expected_at' => optional($o->data_solicitada)->addDays(7)->format('d/m/Y') ?? '—',
                'total' => round($total, 2),
                'status' => $this->mapStatusToFrontend($o->status),
                'notes' => $o->observacoes ?? null,
                'lines' => $lines,
            ];
        })->values();

        

        $demandaSub = DB::table('encomenda_livro_aluno_itens')
            ->selectRaw('livro_id, SUM(GREATEST(IFNULL(quantidade,0) - IFNULL(quantidade_entregue,0), 0)) as demanda')
            ->groupBy('livro_id');

        $alocadoSub = DB::table('alocacoes_stock')
            ->selectRaw('livro_id, SUM(IFNULL(quantidade_alocada, 0)) as alocado')
            ->groupBy('livro_id');

        $stockSub = DB::table('stocks')
            ->selectRaw('livro_id, SUM(IFNULL(quantidade, 0)) as stock')
            ->groupBy('livro_id');

        $transitoSub = DB::table('encomenda_livro_editora_itens as it')
            ->join('encomendas_editora as e', 'e.id', '=', 'it.encomenda_editora_id')
            ->whereIn('e.status', ['SOLICITADO', 'ENTREGA_PARCIAL'])
            ->selectRaw('it.livro_id, SUM(GREATEST(IFNULL(it.qtd_solicitada,0) - IFNULL(it.qtd_recebida_total,0), 0)) as transito')
            ->groupBy('it.livro_id');

        $raw = DB::table('livros as l')
            ->join('editoras as ed', 'ed.id', '=', 'l.editora_id')
            ->leftJoinSub($demandaSub, 'd', 'd.livro_id', '=', 'l.id')
            ->leftJoinSub($stockSub, 's', 's.livro_id', '=', 'l.id')
            ->leftJoinSub($alocadoSub, 'a', 'a.livro_id', '=', 'l.id')
            ->leftJoinSub($transitoSub, 't', 't.livro_id', '=', 'l.id')
            ->where('l.ativo', 1)
            ->selectRaw('
                l.id as livro_id,
                l.titulo,
                l.isbn,
                l.preco,
                l.editora_id,
                ed.nome as editora_nome,
                IFNULL(d.demanda, 0) as demanda,
                IFNULL(s.stock, 0) as stock,
                IFNULL(a.alocado, 0) as alocado,
                IFNULL(t.transito, 0) as transito
            ')
            ->get()
            ->map(function ($row) {
                $disponivel = max(0, (int)$row->stock - (int)$row->alocado);
                $necessario = max(0, (int)$row->demanda - $disponivel - (int)$row->transito);

                return [
                    'livro_id' => (int) $row->livro_id,
                    'title' => $row->titulo,
                    'isbn' => $row->isbn ?? '—',
                    'unit_price' => (float) ($row->preco ?? 0),
                    'qty_needed' => $necessario,
                    'editora_id' => (int) $row->editora_id,
                    'editora_nome' => $row->editora_nome,
                ];
            })
            ->filter(fn ($x) => $x['qty_needed'] > 0)
            ->values();

        $toOrderGrouped = $raw
            ->groupBy('editora_id')
            ->map(function ($items, $editoraId) {
                $items = $items->values();
                $publisherName = $items[0]['editora_nome'] ?? '—';

                $mappedItems = $items->map(fn ($it) => [
                    'id' => $it['livro_id'],
                    'title' => $it['title'],
                    'isbn' => $it['isbn'],
                    'qty_needed' => (int) $it['qty_needed'],
                    'unit_price' => (float) $it['unit_price'],
                ])->values();

                $total = $mappedItems->sum(fn ($it) => ($it['unit_price'] ?? 0) * ($it['qty_needed'] ?? 0));

                return [
                    'publisher' => [
                        'id' => (int) $editoraId,
                        'name' => $publisherName,
                    ],
                    'items' => $mappedItems,
                    'total' => round($total, 2),
                ];
            })
            ->values();

        return Inertia::render('Orders/Editora/Index', [
            'stats' => $stats,
            'orders' => $orders,
            'toOrderGrouped' => $toOrderGrouped,
        ]);
    }
    public function receive(Request $request)
{
    $data = $request->validate([
        'order_id' => ['required', 'integer', 'exists:encomendas_editora,id'],
        'lines' => ['required', 'array', 'min:1'],
        'lines.*.line_id' => ['required', 'integer', 'exists:encomenda_livro_editora_itens,id'],
        'lines.*.receive_now' => ['required', 'integer', 'min:0'],
    ]);

    return DB::transaction(function () use ($data) {

        
        $order = EncomendaEditora::query()
            ->with(['itens.livro']) 
            ->lockForUpdate()
            ->findOrFail($data['order_id']);

        
        $receiveMap = collect($data['lines'])
            ->keyBy('line_id')
            ->map(fn ($x) => (int) $x['receive_now']);

        
        $orderItemIds = $order->itens->pluck('id')->all();
        foreach ($receiveMap->keys() as $lineId) {
            if (!in_array((int)$lineId, $orderItemIds, true)) {
                throw ValidationException::withMessages([
                    'lines' => ["Linha {$lineId} não pertence à encomenda."],
                ]);
            }
        }

        $anyReceived = false;

        foreach ($order->itens as $item) {
            $receiveNow = (int) ($receiveMap[$item->id] ?? 0);
            if ($receiveNow <= 0) continue;

            $qtdSolicitada = (int) ($item->qtd_solicitada ?? 0);
            $qtdRecebidaTotal = (int) ($item->qtd_recebida_total ?? 0);
            $pendente = max(0, $qtdSolicitada - $qtdRecebidaTotal);

            
            if ($receiveNow > $pendente) {
                throw ValidationException::withMessages([
                    'lines' => ["A quantidade a receber excede o pendente no item {$item->id}."],
                ]);
            }

            
            $item->qtd_recebida_total = $qtdRecebidaTotal + $receiveNow;
            $item->save();

            
            $stock = Stock::query()->lockForUpdate()->firstOrCreate(
                ['livro_id' => $item->livro_id],
                ['quantidade' => 0]
            );

            $stock->quantidade = (int) $stock->quantidade + $receiveNow;
            $stock->save();

            
            
            StockMovimento::create([
                'livro_id' => $item->livro_id,
                'tipo' => 1,
                'quantidade' => $receiveNow,
                'observacao' => 'Recebimento encomenda editora #' . $order->id,
            ]);

            $anyReceived = true;
        }

        
        if (!$anyReceived) {
            throw ValidationException::withMessages([
                'lines' => ['Indica pelo menos uma quantidade a receber.'],
            ]);
        }

        
        $order->refresh(); 
        $hasPending = $order->itens->contains(function ($it) {
            $qtdSolicitada = (int) ($it->qtd_solicitada ?? 0);
            $qtdRecebidaTotal = (int) ($it->qtd_recebida_total ?? 0);
            return ($qtdSolicitada - $qtdRecebidaTotal) > 0;
        });

        $order->status = $hasPending ? 'ENTREGA_PARCIAL' : 'ENTREGA_COMPLETA';
        $order->save();

        return redirect()->route('orders.editora.index')
            ->with('success', 'Recebimento registado com sucesso.');
    });
}
public function store(Request $request)
{
    $data = $request->validate([
        'publisher_id' => ['required', 'integer', 'exists:editoras,id'],
        'notes' => ['nullable', 'string', 'max:2000'],
        'lines' => ['required', 'array', 'min:1'],
        'lines.*.livro_id' => ['required', 'integer', 'exists:livros,id'],
        'lines.*.qty' => ['required', 'integer', 'min:1'],
    ]);

    return DB::transaction(function () use ($data) {

        
        if (count($data['lines']) === 0) {
            throw ValidationException::withMessages([
                'lines' => ['Indica pelo menos um livro com quantidade > 0.'],
            ]);
        }

        
        $order = EncomendaEditora::create([
            'editora_id' => $data['publisher_id'],
            'status' => 'SOLICITADO',
            'data_solicitada' => now(),
        ]);

        
        foreach ($data['lines'] as $line) {
            EncomendaLivroEditoraItem::create([
                'encomenda_editora_id' => $order->id,
                'livro_id' => $line['livro_id'],
                'qtd_solicitada' => (int) $line['qty'],
                'qtd_recebida_total' => 0,
            ]);
        }

        return redirect()->route('orders.editora.index')
            ->with('success', 'Encomenda criada com sucesso.');
    });
}

    private function mapStatusToFrontend(?string $status): string
{
    return match ($status) {
        'SOLICITADO' => 'SOLICITADO',
        'ENTREGA_PARCIAL' => 'ENTREGA_PARCIAL',
        'ENTREGA_COMPLETA' => 'ENTREGUE',
        default => 'SOLICITADO',
    };
}
}