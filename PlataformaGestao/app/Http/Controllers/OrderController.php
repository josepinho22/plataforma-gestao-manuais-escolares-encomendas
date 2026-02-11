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
                'itens.livro.editora'
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

        // Transformar dados para o formato frontend
        $orders = $encomendas->map(function($encomenda) {
            return [
                'id' => $encomenda->id,
                'nif' => $encomenda->nif,
                'id_mega' => $encomenda->id_mega,
                'student_name' => $encomenda->nome,
                'telefone' => $encomenda->telefone,
                'school' => $encomenda->escola?->nome ?? 'N/A',
                'year' => $encomenda->anoEscolar?->nome ?? 'N/A',
                'ano_letivo' => $encomenda->anoLetivo?->nome ?? 'N/A',
                'date' => $encomenda->created_at->format('d/m/Y'),
                'status' => $this->mapStatus($encomenda->status),
                'observacao' => $encomenda->observacao,
                'total' => $this->calculateTotal($encomenda->itens),
                'items' => $encomenda->itens->map(function($item) {
                    return [
                        'id' => $item->id,
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
                'badge' => 'processamento'
            ],
            'AGUARDA_ENCAPAMENTO' => [
                'value' => 'AGUARDA_ENCAPAMENTO',
                'label' => 'Aguarda Encapamento',
                'color' => 'bg-purple-100 text-purple-800',
                'badge' => 'processamento'
            ],
            'AGUARDA_LEVANTAMENTO' => [
                'value' => 'AGUARDA_LEVANTAMENTO',
                'label' => 'Aguarda Levantamento',
                'color' => 'bg-indigo-100 text-indigo-800',
                'badge' => 'processamento'
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
            ->get(['id', 'nome']);

        $anos_escolares = AnoEscolar::orderBy('id')
            ->get(['id', 'name'])
            ->map(function($ano) {
                return [
                    'id' => $ano->id,
                    'nome' => $ano->name, // Map 'name' to 'nome' for frontend consistency
                ];
            });

        return Inertia::render('Orders/Create', [
            'schools' => $schools,
            'anos_escolares' => $anos_escolares,
        ]);
    }

    /**
     * API: Lookup de aluno por NIF ou ID Mega
     */
    public function studentLookup(Request $request)
    {
        $nif = $request->input('nif');
        $idMega = $request->input('id_mega');

        // Procurar na tabela de encomendas anteriores (snapshot)
        $encomenda = EncomendaAluno::query()
            ->when($nif, fn($q) => $q->where('nif', $nif))
            ->when($idMega, fn($q) => $q->where('id_mega', $idMega))
            ->orderBy('created_at', 'desc')
            ->first();

        if ($encomenda) {
            return response()->json([
                'found' => true,
                'nome' => $encomenda->nome,
                'telefone' => $encomenda->telefone,
                'email' => null, // Email não está na tabela encomendas_aluno
            ]);
        }

        // Se não encontrar, procurar na tabela de alunos (se existir)
        $aluno = \App\Models\Aluno::query()
            ->when($nif, fn($q) => $q->where('nif', $nif))
            ->when($idMega, fn($q) => $q->where('id_mega', $idMega))
            ->first();

        if ($aluno) {
            return response()->json([
                'found' => true,
                'nome' => $aluno->nome,
                'telefone' => $aluno->telefone,
                'email' => $aluno->email,
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

        // Buscar ano letivo atual (assumindo o mais recente)
        $anoLetivo = AnoLetivo::orderBy('data_inicio', 'desc')->first();

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
            'escola_id' => 'required|exists:escolas,id',
            'ano_escolar_id' => 'required|exists:anos_escolares,id',
            'ano_letivo_id' => 'required|exists:anos_letivos,id',
            'observacao' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.livro_id' => 'required|exists:livros,id',
            'items.*.quantidade' => 'required|integer|min:1',
            'items.*.encapar' => 'boolean',
        ]);

        $encomendaExistente = EncomendaAluno::where('nif', $validated['nif'])
            ->where('escola_id', $validated['escola_id'])
            ->where('ano_letivo_id', $validated['ano_letivo_id'])
            ->where('ano_escolar_id', $validated['ano_escolar_id'])
            ->whereNotIn('status', ['ENTREGUE', 'CANCELADA']) // Ignora se já estiver fechada
            ->first();

        if ($encomendaExistente) {
            return back()->withErrors([
                'nif' => 'Este aluno já possui uma encomenda ativa (#' . $encomendaExistente->id . ') nesta escola e ano.'
            ])->withInput();
        }

        try {
            DB::beginTransaction();

            // Buscar a lista correspondente
            $lista = ListaLivro::where('escola_id', $validated['escola_id'])
                ->where('ano_letivo_id', $validated['ano_letivo_id'])
                ->where('ano_escolar_id', $validated['ano_escolar_id'])
                ->first();

            // Criar encomenda
            $encomenda = EncomendaAluno::create([
                'aluno_id' => null, // Pode ser implementado lookup mais tarde
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

            // Criar items da encomenda
            foreach ($validated['items'] as $item) {
                EncomendaLivroAlunoItem::create([
                    'encomenda_aluno_id' => $encomenda->id,
                    'livro_id' => $item['livro_id'],
                    'quantidade' => $item['quantidade'],
                    'encapar' => $item['encapar'] ?? false,
                    'encapado' => false,
                    'quantidade_entregue' => 0,
                    'entregue' => false,
                    'ensacado' => false,
                ]);
            }

            DB::commit();

            return redirect()
                ->route('orders.index')
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

            // Verificar se todos os itens da encomenda foram entregues
            if ($validated['field'] === 'entregue' && $validated['value'] === true) {
                $this->checkAndUpdateOrderStatus($orderId);
            }

            return response()->json([
                'success' => true,
                'message' => 'Item atualizado com sucesso',
                'item' => [
                    'id' => $item->id,
                    'encapado' => $item->encapado,
                    'ensacado' => $item->ensacado,
                    'entregue' => $item->entregue,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao atualizar item: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Verificar se todos os itens foram entregues e atualizar status da encomenda
     */
    private function checkAndUpdateOrderStatus($orderId)
    {
        $order = EncomendaAluno::with('itens')->find($orderId);

        if (!$order) {
            return;
        }

        $allDelivered = $order->itens->every(function($item) {
            return $item->entregue === true;
        });

        if ($allDelivered && $order->status !== 'ENTREGUE') {
            $oldStatus = $order->status;
            $order->status = 'ENTREGUE';
            $order->save();

            // Criar registo de auditoria para a encomenda
            AuditLog::create([
                'user_id' => auth()->id(),
                'entity_type' => 'EncomendaAluno',
                'entity_id' => $order->id,
                'action' => 'status_auto_updated',
                'changes' => [
                    'old_status' => $oldStatus,
                    'new_status' => 'ENTREGUE',
                    'reason' => 'Todos os itens foram entregues',
                ],
                'created_at' => now(),
            ]);
        }
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
        $messages = [
            'updated_encapado' => $changes['new_value']
                ? "Marcou '{$changes['livro_titulo']}' como encapado"
                : "Desmarcou encapamento de '{$changes['livro_titulo']}'",
            'updated_ensacado' => $changes['new_value']
                ? "Marcou '{$changes['livro_titulo']}' como ensacado"
                : "Desmarcou ensacamento de '{$changes['livro_titulo']}'",
            'updated_entregue' => $changes['new_value']
                ? "Marcou '{$changes['livro_titulo']}' como entregue"
                : "Desmarcou entrega de '{$changes['livro_titulo']}'",
            'status_auto_updated' => "Status alterado automaticamente de '{$changes['old_status']}' para '{$changes['new_status']}'",
        ];

        return $messages[$action] ?? 'Ação não reconhecida';
    }
}
