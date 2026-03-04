<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\EncomendaAluno;
use App\Models\EncomendaLivroAlunoItem;
use App\Models\Escola;
use App\Models\AnoEscolar;
use App\Models\AnoLetivo;
use App\Models\ListaLivro;
use App\Models\Livro;
use App\Models\Concelho;
use App\Models\AuditLog;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        // Buscar encomendas com todas as relações necessárias
        $query = EncomendaAluno::query()
            ->with([
                'aluno',
                'escola.concelho',
                'anoEscolar',
                'anoLetivo',
                'lista',
                'itens.livro.disciplina',
                'itens.livro.editora',
                'itens.livro.stock',
            ]);

        // Filtro de pesquisa (por nome do aluno, NIF ou ID)
        $query->when($request->input('search'), function($q, $search) {
            $q->where(function($subQ) use ($search) {
                $subQ->where('nome', 'like', "%{$search}%")
                     ->orWhere('nif', 'like', "%{$search}%")
                     ->orWhere('id', $search);
            });
        });

        // Filtro por escola
        $query->when($request->input('escola_id'), function($q, $escolaId) {
            $q->where('escola_id', $escolaId);
        });

        // Filtro por ano escolar
        $query->when($request->input('ano_escolar_id'), function($q, $anoEscolarId) {
            $q->where('ano_escolar_id', $anoEscolarId);
        });

        // Filtro por status
        $query->when($request->input('status'), function($q, $status) {
            $q->where('status', $status);
        });

        // Filtro por concelho (via relação escola)
        $query->when($request->input('concelho_id'), function($q, $concelhoId) {
            $q->whereHas('escola', function($subQ) use ($concelhoId) {
                $subQ->where('concelho_id', $concelhoId);
            });
        });

        // Ordenação dinâmica (default: mais recentes)
        $sort = $request->input('sort', 'desc');
        $query->orderBy('created_at', $sort === 'asc' ? 'asc' : 'desc');

        // Paginação
        $encomendas = $query->paginate(10);

        // Recalcular status das encomendas em AGUARDA_LIVROS (podem ter stock agora)
        foreach ($encomendas as $encomenda) {
            if ($encomenda->status === 'AGUARDA_LIVROS') {
                $encomenda->load(['itens.alocacoesStock', 'itens.livro.stock']);
                $encomenda->recalculateStatus();
            }
        }

        // Transformar dados para o formato frontend
        $orders = $encomendas->map(function($encomenda) {
            return [
                'id' => $encomenda->id,
                'nif' => $encomenda->nif,
                'id_mega' => $encomenda->id_mega,
                'student_name' => $encomenda->nome,
                'telefone' => $encomenda->telefone,
                'school' => $encomenda->escola?->nome ?? 'N/A',
                'concelho' => $encomenda->escola?->concelho?->nome ?? 'N/A',
                'year' => $encomenda->anoEscolar?->name ?? 'N/A',
                'ano_letivo' => $encomenda->anoLetivo?->nome ?? 'N/A',
                'date' => $encomenda->created_at->format('d/m/Y'),
                'status' => $this->mapStatus($encomenda->status),
                'observacao' => $encomenda->observacao,
                'total' => $this->calculateTotal($encomenda->itens),
                'items' => $encomenda->itens->map(function($item) {
                    return [
                        'id' => $item->id,
                        'livro_id' => $item->livro_id,
                        'title' => $item->livro?->titulo ?? 'Livro não encontrado',
                        'isbn' => $item->livro?->isbn,
                        'disciplina' => $item->livro?->disciplina?->nome,
                        'editora' => $item->livro?->editora?->nome,
                        'quantity' => $item->quantidade,
                        'price' => (float) $item->livro?->preco ?? 0,
                        'subtotal' => (float) ($item->livro?->preco ?? 0) * $item->quantidade,
                        // Campos para checklist do modal
                        'encapar' => $item->encapar,
                        'encapado' => $item->encapado,
                        'ensacado' => $item->ensacado,
                        'entregue' => $item->entregue,
                        'quantidade_entregue' => $item->quantidade_entregue,
                        'stock_disponivel' => $item->livro?->stock?->quantidade ?? 0,
                    ];
                })->toArray(),
            ];
        });

        // Calcular estatísticas reais
        $stats = [
            'pendentes' => EncomendaAluno::where('status', 'AGUARDA_LIVROS')->count(),
            'processamento' => EncomendaAluno::whereIn('status', [
                'AGUARDA_ENSACAMENTO',
                'AGUARDA_ENCAPAMENTO',
                'AGUARDA_LEVANTAMENTO'
            ])->count(),
            'concluidas' => EncomendaAluno::where('status', 'ENTREGUE')->count(),
        ];

        // Dados para os dropdowns de filtros
        $schools = Escola::where('isAtivo', true)
            ->orderBy('nome')
            ->get(['id', 'nome', 'concelho_id']);

        $years = AnoEscolar::orderBy('id')
            ->get(['id', 'name'])
            ->map(function($ano) {
                return [
                    'id' => $ano->id,
                    'nome' => $ano->name,
                ];
            });

        $concelhos = \App\Models\Concelho::orderBy('nome')
            ->get(['id', 'nome']);

        $statuses = [
            ['value' => 'AGUARDA_LIVROS', 'label' => 'Aguarda Livros'],
            ['value' => 'AGUARDA_ENSACAMENTO', 'label' => 'Aguarda Ensacamento'],
            ['value' => 'AGUARDA_ENCAPAMENTO', 'label' => 'Aguarda Encapamento'],
            ['value' => 'AGUARDA_LEVANTAMENTO', 'label' => 'Aguarda Levantamento'],
            ['value' => 'ENTREGUE', 'label' => 'Entregue'],
        ];

        return Inertia::render('Orders/Index', [
            'orders' => [
                'data' => $orders,
                'current_page' => $encomendas->currentPage(),
                'last_page' => $encomendas->lastPage(),
                'per_page' => $encomendas->perPage(),
                'total' => $encomendas->total(),
            ],
            'stats' => $stats,
            'filterOptions' => [
                'schools' => $schools,
                'years' => $years,
                'concelhos' => $concelhos,
                'statuses' => $statuses,
            ],
            'filters' => [
                'search' => $request->input('search', ''),
                'escola_id' => $request->input('escola_id', ''),
                'ano_escolar_id' => $request->input('ano_escolar_id', ''),
                'concelho_id' => $request->input('concelho_id', ''),
                'status' => $request->input('status', ''),
                'sort' => $request->input('sort', 'desc'),
            ]
        ]);
    }

    /**
     * Mapear status ENUM para objeto legível no frontend
     */
    private function mapStatus(string $status): array
    {
        $statusMap = [
            'AGUARDA_LIVROS' => [
                'value' => 'AGUARDA_LIVROS',
                'label' => 'Aguarda Livros',
                'color' => 'bg-yellow-100 text-yellow-800',
                'badge' => 'pendente'
            ],
            'AGUARDA_ENSACAMENTO' => [
                'value' => 'AGUARDA_ENSACAMENTO',
                'label' => 'Aguarda Ensacamento',
                'color' => 'bg-blue-100 text-blue-800',
                'badge' => 'ensacamento'
            ],
            'AGUARDA_ENCAPAMENTO' => [
                'value' => 'AGUARDA_ENCAPAMENTO',
                'label' => 'Aguarda Encapamento',
                'color' => 'bg-purple-100 text-purple-800',
                'badge' => 'encapamento'
            ],
            'AGUARDA_LEVANTAMENTO' => [
                'value' => 'AGUARDA_LEVANTAMENTO',
                'label' => 'Aguarda Levantamento',
                'color' => 'bg-indigo-100 text-indigo-800',
                'badge' => 'levantamento'
            ],
            'ENTREGUE' => [
                'value' => 'ENTREGUE',
                'label' => 'Entregue',
                'color' => 'bg-green-100 text-green-800',
                'badge' => 'concluida'
            ],
        ];

        return $statusMap[$status] ?? [
            'value' => $status,
            'label' => $status,
            'color' => 'bg-gray-100 text-gray-800',
            'badge' => 'pendente'
        ];
    }

    /**
     * Calcular total da encomenda
     */
    private function calculateTotal($itens): string
    {
        $total = $itens->sum(function($item) {
            return ($item->livro?->preco ?? 0) * $item->quantidade;
        });

        return number_format($total, 2, '.', '');
    }

    /**
     * Renderizar página de criação de encomenda
     */
    public function create()
    {
        $schools = Escola::where('isAtivo', true)
            ->orderBy('nome')
            ->get(['id', 'nome', 'concelho_id']);

        $concelhos = Concelho::orderBy('nome')
            ->get(['id', 'nome']);

        $anos_escolares = AnoEscolar::orderBy('id')
            ->get(['id', 'name'])
            ->map(function($ano) {
                return [
                    'id' => $ano->id,
                    'nome' => $ano->name,
                ];
            });

        $anoLetivoAtual = AnoLetivo::orderBy('id', 'desc')->first(['id', 'nome']);

        return Inertia::render('Orders/Create', [
            'schools' => $schools,
            'concelhos' => $concelhos,
            'anos_escolares' => $anos_escolares,
            'ano_letivo_atual' => $anoLetivoAtual,
        ]);
    }

    /**
     * API: Lookup de aluno por NIF ou ID Mega
     */
    public function studentLookup(Request $request)
    {
        $nif = $request->input('nif');
        $idMega = $request->input('id_mega');

        // Procurar primeiro na tabela de alunos (fonte de verdade)
        $aluno = \App\Models\Aluno::query()
            ->when($nif, fn($q) => $q->where('nif', $nif))
            ->when($idMega, fn($q) => $q->where('id_mega', $idMega))
            ->first();

        if ($aluno) {
            return response()->json([
                'found' => true,
                'nif' => $aluno->nif,
                'nome' => $aluno->nome,
                'telefone' => $aluno->telefone,
                'email' => $aluno->email,
                'id_mega' => $aluno->id_mega,
            ]);
        }

        // Fallback: procurar em encomendas anteriores (snapshot)
        $encomenda = EncomendaAluno::query()
            ->when($nif, fn($q) => $q->where('nif', $nif))
            ->when($idMega, fn($q) => $q->where('id_mega', $idMega))
            ->orderBy('created_at', 'desc')
            ->first();

        if ($encomenda) {
            return response()->json([
                'found' => true,
                'nif' => $encomenda->nif,
                'nome' => $encomenda->nome,
                'telefone' => $encomenda->telefone,
                'email' => null,
                'id_mega' => $encomenda->id_mega,
            ]);
        }

        return response()->json([
            'found' => false,
        ]);
    }

    /**
     * API: Buscar livros por escola e ano escolar
     */
    public function searchBooks(Request $request)
    {
        $escolaId = $request->input('escola_id');
        $anoEscolarId = $request->input('ano_escolar_id');

        $debug = [];

        if (!$escolaId || !$anoEscolarId) {
            return response()->json([
                'books' => [],
                'debug' => ['error' => 'Escola ID ou Ano Escolar ID não fornecidos']
            ]);
        }

        $debug['escola_id'] = $escolaId;
        $debug['ano_escolar_id'] = $anoEscolarId;

        // Buscar ano letivo atual (último adicionado)
        $anoLetivo = AnoLetivo::orderBy('id', 'desc')->first();

        if (!$anoLetivo) {
            return response()->json([
                'books' => [],
                'debug' => array_merge($debug, [
                    'error' => 'Nenhum ano letivo encontrado na base de dados',
                    'solucao' => 'Crie um ano letivo na base de dados'
                ])
            ]);
        }

        $debug['ano_letivo_id'] = $anoLetivo->id;
        $debug['ano_letivo_nome'] = $anoLetivo->nome;

        // Buscar lista de livros para esta combinação
        $lista = ListaLivro::where('escola_id', $escolaId)
            ->where('ano_letivo_id', $anoLetivo->id)
            ->where('ano_escolar_id', $anoEscolarId)
            ->with('itens.manualLivro.editora', 'itens.cadernoLivro.editora')
            ->first();

        if (!$lista) {
            // Verificar se existem listas para esta escola
            $listasEscola = ListaLivro::where('escola_id', $escolaId)->count();

            return response()->json([
                'books' => [],
                'debug' => array_merge($debug, [
                    'error' => 'Nenhuma lista de livros encontrada para esta combinação',
                    'listas_existentes_escola' => $listasEscola,
                    'solucao' => 'Crie uma lista de livros para Escola ID ' . $escolaId . ', Ano Letivo ID ' . $anoLetivo->id . ', Ano Escolar ID ' . $anoEscolarId
                ])
            ]);
        }

        $debug['lista_id'] = $lista->id;
        $debug['lista_itens_count'] = $lista->itens->count();

        // Coletar todos os livros (manuais e cadernos)
        $books = [];

        foreach ($lista->itens as $item) {
            // Adicionar manual se existir
            if ($item->manualLivro) {
                $books[] = [
                    'id' => $item->manualLivro->id,
                    'titulo' => $item->manualLivro->titulo,
                    'isbn' => $item->manualLivro->isbn,
                    'preco' => (float) $item->manualLivro->preco,
                    'editora_nome' => $item->manualLivro->editora?->nome ?? 'N/A',
                    'tipo' => 'Manual',
                ];
            }

            // Adicionar caderno se existir
            if ($item->cadernoLivro) {
                $books[] = [
                    'id' => $item->cadernoLivro->id,
                    'titulo' => $item->cadernoLivro->titulo,
                    'isbn' => $item->cadernoLivro->isbn,
                    'preco' => (float) $item->cadernoLivro->preco,
                    'editora_nome' => $item->cadernoLivro->editora?->nome ?? 'N/A',
                    'tipo' => 'Caderno',
                ];
            }
        }

        $debug['books_found'] = count($books);

        if (count($books) === 0) {
            $debug['error'] = 'Lista encontrada mas sem livros associados';
            $debug['solucao'] = 'Adicione livros (manuais ou cadernos) aos itens da lista ID ' . $lista->id;
        }

        return response()->json([
            'books' => $books,
            'debug' => $debug
        ]);
    }

    /**
     * Guardar nova encomenda
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nif' => 'required|string|max:20',
            'id_mega' => 'nullable|string|max:50',
            'nome' => 'required|string|max:255',
            'telefone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'escola_id' => 'required|exists:escolas,id',
            'ano_escolar_id' => 'required|exists:anos_escolares,id',
            'ano_letivo_id' => 'required|exists:anos_letivos,id',
            'observacao' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.livro_id' => 'required|exists:livros,id',
            'items.*.quantidade' => 'required|integer|min:1',
            'items.*.encapar' => 'boolean',
        ]);

        try {
            DB::beginTransaction();

            // Buscar a lista correspondente
            $lista = ListaLivro::where('escola_id', $validated['escola_id'])
                ->where('ano_letivo_id', $validated['ano_letivo_id'])
                ->where('ano_escolar_id', $validated['ano_escolar_id'])
                ->first();

            // Criar ou atualizar aluno na tabela de alunos
            $aluno = \App\Models\Aluno::updateOrCreate(
                ['nif' => $validated['nif']],
                [
                    'nome' => $validated['nome'],
                    'telefone' => $validated['telefone'] ?? null,
                    'email' => $validated['email'] ?? null,
                    'id_mega' => $validated['id_mega'] ?? null,
                ]
            );

            // Criar encomenda
            $encomenda = EncomendaAluno::create([
                'aluno_id' => $aluno->id,
                'nif' => $validated['nif'],
                'id_mega' => $validated['id_mega'],
                'nome' => $validated['nome'],
                'telefone' => $validated['telefone'],
                'escola_id' => $validated['escola_id'],
                'ano_letivo_id' => $validated['ano_letivo_id'],
                'ano_escolar_id' => $validated['ano_escolar_id'],
                'lista_id' => $lista?->id,
                'status' => 'AGUARDA_LIVROS',
                'observacao' => $validated['observacao'],
            ]);

            // Criar items da encomenda — uma linha por unidade física
            foreach ($validated['items'] as $item) {
                for ($i = 0; $i < $item['quantidade']; $i++) {
                    EncomendaLivroAlunoItem::create([
                        'encomenda_aluno_id' => $encomenda->id,
                        'livro_id' => $item['livro_id'],
                        'quantidade' => 1,
                        'encapar' => $item['encapar'] ?? false,
                        'encapado' => false,
                        'quantidade_entregue' => 0,
                        'entregue' => false,
                        'ensacado' => false,
                    ]);
                }
            }

            // Recalcular status com base no stock disponível
            $this->checkAndUpdateOrderStatus($encomenda->id);

            DB::commit();

            return redirect()
                ->route('orders.clientes.index')
                ->with('success', 'Encomenda criada com sucesso! ID: #' . $encomenda->id);

        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withErrors(['error' => 'Erro ao criar encomenda: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Atualizar item individual da encomenda (checkboxes de processamento)
     */
    public function updateItem(Request $request, $orderId, $itemId)
    {
        $validated = $request->validate([
            'field' => 'required|in:encapado,ensacado,entregue',
            'value' => 'required|boolean',
        ]);

        try {
            $item = EncomendaLivroAlunoItem::where('id', $itemId)
                ->where('encomenda_aluno_id', $orderId)
                ->firstOrFail();

            $oldValue = $item->{$validated['field']};
            $item->{$validated['field']} = $validated['value'];
            $item->save();

            // Ajustar stock quando o estado de ensacamento muda
            if ($validated['field'] === 'ensacado' && $item->livro_id) {
                $stock = \App\Models\Stock::where('livro_id', $item->livro_id)->first();
                if ($validated['value']) {
                    // Marcar como ensacado: deduzir stock
                    $stock = \App\Models\Stock::firstOrCreate(
                        ['livro_id' => $item->livro_id],
                        ['quantidade' => 0]
                    );
                    $stock->quantidade = max(0, $stock->quantidade - $item->quantidade);
                    $stock->save();
                } else {
                    // Desensacar: devolver ao stock (só se antes estava marcado como ensacado)
                    if ($oldValue && $stock) {
                        $stock->quantidade += $item->quantidade;
                        $stock->save();
                    } elseif ($oldValue) {
                        \App\Models\Stock::create([
                            'livro_id' => $item->livro_id,
                            'quantidade' => $item->quantidade,
                        ]);
                    }
                }
            }

            // Criar registo de auditoria
            AuditLog::create([
                'user_id' => auth()->id(),
                'entity_type' => 'EncomendaLivroAlunoItem',
                'entity_id' => $item->id,
                'action' => 'updated_' . $validated['field'],
                'changes' => [
                    'field' => $validated['field'],
                    'old_value' => $oldValue,
                    'new_value' => $validated['value'],
                    'livro_titulo' => $item->livro?->titulo ?? 'N/A',
                ],
                'created_at' => now(),
            ]);

            // Recalcular status da encomenda com base no estado dos itens
            $newStatus = $this->checkAndUpdateOrderStatus($orderId);

            // Recarregar stock atualizado
            $item->load('livro.stock');

            return response()->json([
                'success' => true,
                'message' => 'Item atualizado com sucesso',
                'item' => [
                    'id' => $item->id,
                    'encapado' => $item->encapado,
                    'ensacado' => $item->ensacado,
                    'entregue' => $item->entregue,
                    'stock_disponivel' => $item->livro?->stock?->quantidade ?? 0,
                ],
                'order_status' => $newStatus ? $this->mapStatus($newStatus) : null,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar item: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Recalcular e atualizar status da encomenda com base no estado dos itens
     */
    private function checkAndUpdateOrderStatus($orderId): ?string
    {
        $order = EncomendaAluno::find($orderId);

        if (!$order) {
            return null;
        }

        return $order->recalculateStatus();
    }

    /**
     * Obter histórico de uma encomenda
     */
    public function getHistory($orderId)
    {
        $history = AuditLog::where(function($q) use ($orderId) {
            $q->where('entity_type', 'EncomendaAluno')
              ->where('entity_id', $orderId);
        })->orWhere(function($q) use ($orderId) {
            $q->where('entity_type', 'EncomendaLivroAlunoItem')
              ->whereIn('entity_id', function($subQ) use ($orderId) {
                  $subQ->select('id')
                       ->from('encomenda_livro_aluno_itens')
                       ->where('encomenda_aluno_id', $orderId);
              });
        })
        ->with('user:id,name')
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function($log) {
            return [
                'id' => $log->id,
                'user_name' => $log->user?->name ?? 'Sistema',
                'action' => $this->formatAction($log->action, $log->changes),
                'timestamp' => $log->created_at->diffForHumans(),
                'timestamp_full' => $log->created_at->format('d/m/Y H:i:s'),
            ];
        });

        return response()->json(['history' => $history]);
    }

    /**
     * Formatar ação do histórico para mensagem legível
     */
    private function formatAction($action, $changes)
    {
        $livroTitulo = $changes['livro_titulo'] ?? '';

        $messages = [
            'updated_encapado' => ($changes['new_value'] ?? false)
                ? "Marcou '{$livroTitulo}' como encapado"
                : "Desmarcou encapamento de '{$livroTitulo}'",
            'updated_ensacado' => ($changes['new_value'] ?? false)
                ? "Marcou '{$livroTitulo}' como ensacado"
                : "Desmarcou ensacamento de '{$livroTitulo}'",
            'updated_entregue' => ($changes['new_value'] ?? false)
                ? "Marcou '{$livroTitulo}' como entregue"
                : "Desmarcou entrega de '{$livroTitulo}'",
            'status_auto_updated' => "Status alterado automaticamente de '" . ($changes['old_status'] ?? '') . "' para '" . ($changes['new_status'] ?? '') . "'",
            'updated_quantidade' => "Alterou quantidade de '{$livroTitulo}' de " . ($changes['old_value'] ?? '?') . " para " . ($changes['new_value'] ?? '?'),
            'updated_livro' => "Trocou livro de '" . ($changes['old_livro'] ?? '?') . "' para '" . ($changes['new_livro'] ?? '?') . "'",
            'order_deleted' => "Encomenda eliminada",
        ];

        return $messages[$action] ?? $action;
    }

    /**
     * Gerar PDF da encomenda
     */
    public function printPDF($orderId)
    {
        $encomenda = EncomendaAluno::with([
            'escola', 'anoEscolar', 'anoLetivo',
            'itens.livro.editora'
        ])->findOrFail($orderId);

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.encomenda', [
            'encomenda' => $encomenda,
        ]);

        return $pdf->stream("encomenda-{$orderId}.pdf");
    }

    /**
     * Normalizar itens legados: dividir qty>1 em linhas individuais (qty=1)
     */
    public function normalizeItems($orderId)
    {
        try {
            $order = EncomendaAluno::findOrFail($orderId);
            $items = $order->itens()->where('quantidade', '>', 1)->get();

            DB::beginTransaction();
            foreach ($items as $item) {
                $qty = $item->quantidade;
                for ($i = 1; $i < $qty; $i++) {
                    EncomendaLivroAlunoItem::create([
                        'encomenda_aluno_id' => $orderId,
                        'livro_id' => $item->livro_id,
                        'quantidade' => 1,
                        'encapar' => $item->encapar,
                        'encapado' => $item->encapado,
                        'ensacado' => $item->ensacado,
                        'entregue' => $item->entregue,
                        'quantidade_entregue' => $item->entregue ? 1 : 0,
                    ]);
                }
                $item->quantidade = 1;
                $item->save();
            }
            DB::commit();

            // Retornar os itens normalizados no mesmo formato do frontend
            $order->load('itens.livro.editora', 'itens.livro.disciplina', 'itens.livro.stock');
            $formattedItems = $order->itens->map(function ($item) {
                return [
                    'id' => $item->id,
                    'livro_id' => $item->livro_id,
                    'title' => $item->livro?->titulo ?? 'Livro não encontrado',
                    'isbn' => $item->livro?->isbn,
                    'disciplina' => $item->livro?->disciplina?->nome,
                    'editora' => $item->livro?->editora?->nome,
                    'quantity' => $item->quantidade,
                    'price' => (float) ($item->livro?->preco ?? 0),
                    'subtotal' => (float) ($item->livro?->preco ?? 0) * $item->quantidade,
                    'encapar' => $item->encapar,
                    'encapado' => $item->encapado,
                    'ensacado' => $item->ensacado,
                    'entregue' => $item->entregue,
                    'quantidade_entregue' => $item->quantidade_entregue,
                    'stock_disponivel' => $item->livro?->stock?->quantidade ?? 0,
                ];
            });

            return response()->json(['success' => true, 'items' => $formattedItems]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Remover livro individual de uma encomenda
     */
    public function deleteItem($orderId, $itemId)
    {
        try {
            $item = EncomendaLivroAlunoItem::where('id', $itemId)
                ->where('encomenda_aluno_id', $orderId)
                ->firstOrFail();

            // Devolver ao stock sempre que um item é removido
            if ($item->livro_id) {
                $stock = \App\Models\Stock::where('livro_id', $item->livro_id)->first();
                if ($stock) {
                    $stock->quantidade += $item->quantidade;
                    $stock->save();
                } else {
                    \App\Models\Stock::create([
                        'livro_id' => $item->livro_id,
                        'quantidade' => $item->quantidade,
                    ]);
                }
            }

            $item->delete();
            $this->checkAndUpdateOrderStatus($orderId);

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Eliminar encomenda (soft delete)
     */
    public function destroy($orderId)
    {
        try {
            $order = EncomendaAluno::findOrFail($orderId);

            AuditLog::create([
                'user_id' => auth()->id(),
                'entity_type' => 'EncomendaAluno',
                'entity_id' => $order->id,
                'action' => 'order_deleted',
                'changes' => [
                    'nif' => $order->nif,
                    'nome' => $order->nome,
                    'status' => $order->status,
                ],
                'created_at' => now(),
            ]);

            // Soft delete dos itens e da encomenda
            $order->itens()->delete();
            $order->delete();

            return response()->json(['success' => true, 'message' => 'Encomenda eliminada com sucesso']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erro ao eliminar: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Editar item da encomenda (quantidade ou livro)
     */
    public function editItem(Request $request, $orderId, $itemId)
    {
        $validated = $request->validate([
            'quantidade' => 'sometimes|integer|min:1',
            'livro_id' => 'sometimes|exists:livros,id',
        ]);

        try {
            $item = EncomendaLivroAlunoItem::where('id', $itemId)
                ->where('encomenda_aluno_id', $orderId)
                ->firstOrFail();

            $newItems = [];

            // Adicionar unidades extras à encomenda e deduzir do stock
            if (isset($validated['quantidade'])) {
                // Como os itens estão normalizados a qty=1, criar items adicionais
                $diff = $validated['quantidade'] - 1;

                if ($diff > 0 && $item->livro_id) {
                    for ($i = 0; $i < $diff; $i++) {
                        $newItemModel = EncomendaLivroAlunoItem::create([
                            'encomenda_aluno_id' => $orderId,
                            'livro_id' => $item->livro_id,
                            'quantidade' => 1,
                            'encapar' => $item->encapar,
                            'encapado' => false,
                            'ensacado' => false,
                            'entregue' => false,
                            'quantidade_entregue' => 0,
                        ]);
                        $newItemModel->load('livro.editora', 'livro.disciplina', 'livro.stock');
                        $newItems[] = $newItemModel;
                    }

                    // Deduzir do stock
                    $stock = \App\Models\Stock::firstOrNew(
                        ['livro_id' => $item->livro_id],
                        ['quantidade' => 0]
                    );
                    $stock->quantidade = max(0, $stock->quantidade - $diff);
                    $stock->save();

                    AuditLog::create([
                        'user_id' => auth()->id(),
                        'entity_type' => 'EncomendaLivroAlunoItem',
                        'entity_id' => $item->id,
                        'action' => 'updated_quantidade',
                        'changes' => [
                            'livro_titulo' => $item->livro?->titulo ?? 'N/A',
                            'old_value' => 1,
                            'new_value' => $validated['quantidade'],
                        ],
                        'created_at' => now(),
                    ]);
                }
            }

            // Trocar livro
            if (isset($validated['livro_id']) && $validated['livro_id'] !== $item->livro_id) {
                $oldLivro = $item->livro?->titulo ?? 'N/A';
                $newLivro = Livro::find($validated['livro_id']);

                $item->livro_id = $validated['livro_id'];

                AuditLog::create([
                    'user_id' => auth()->id(),
                    'entity_type' => 'EncomendaLivroAlunoItem',
                    'entity_id' => $item->id,
                    'action' => 'updated_livro',
                    'changes' => [
                        'old_livro' => $oldLivro,
                        'new_livro' => $newLivro?->titulo ?? 'N/A',
                    ],
                    'created_at' => now(),
                ]);
            }

            $item->save();
            $item->load('livro.editora', 'livro.disciplina', 'livro.stock');

            $formatItem = function ($i) {
                return [
                    'id' => $i->id,
                    'livro_id' => $i->livro_id,
                    'title' => $i->livro?->titulo ?? 'N/A',
                    'isbn' => $i->livro?->isbn,
                    'disciplina' => $i->livro?->disciplina?->nome,
                    'editora' => $i->livro?->editora?->nome,
                    'price' => (float) ($i->livro?->preco ?? 0),
                    'quantity' => $i->quantidade,
                    'encapar' => $i->encapar,
                    'encapado' => $i->encapado,
                    'ensacado' => $i->ensacado,
                    'entregue' => $i->entregue,
                    'quantidade_entregue' => $i->quantidade_entregue ?? 0,
                    'stock_disponivel' => $i->livro?->stock?->quantidade ?? 0,
                ];
            };

            $this->checkAndUpdateOrderStatus($orderId);

            return response()->json([
                'success' => true,
                'item' => $formatItem($item),
                'newItems' => array_map($formatItem, $newItems),
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Erro ao editar: ' . $e->getMessage()], 500);
        }
    }

    /**
     * API: Pesquisar qualquer livro ativo (para adicionar livros fora da lista)
     */
    public function searchAllBooks(Request $request)
    {
        $query = $request->get('q', '');

        if (strlen($query) < 2) {
            return response()->json(['books' => []]);
        }

        $books = Livro::where('ativo', true)
            ->where(function ($q) use ($query) {
                $q->where('titulo', 'like', "%{$query}%")
                  ->orWhere('isbn', 'like', "%{$query}%");
            })
            ->with('editora:id,nome')
            ->limit(20)
            ->get()
            ->map(function ($livro) {
                return [
                    'id' => $livro->id,
                    'titulo' => $livro->titulo,
                    'isbn' => $livro->isbn,
                    'preco' => (float) $livro->preco,
                    'editora_nome' => $livro->editora?->nome ?? 'N/A',
                    'tipo' => $livro->tipo === 'MANUAL' ? 'Manual' : 'Caderno',
                ];
            });

        return response()->json(['books' => $books]);
    }
}
