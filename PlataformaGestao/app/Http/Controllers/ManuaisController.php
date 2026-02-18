<?php

namespace App\Http\Controllers;

use Log;
use Inertia\Inertia;
use App\Models\Livro;
use App\Models\Escola;
use App\Models\Concelho;
use App\Models\AnoLetivo;
use App\Models\AnoEscolar;
use App\Models\ListaLivro;
use App\Models\Disciplina;
use Illuminate\Http\Request;

class ManuaisController extends Controller
{
    public function index(Request $request)
{
    $catalogQuery = Livro::with(['editora', 'disciplina'])->where('ativo', true);

    if ($request->filled('ano_escolar_id')) {
        $catalogQuery->where('ano_escolar_id', $request->ano_escolar_id);
    }

    $catalog = $catalogQuery->get()->map(fn($livro) => [
        'id' => $livro->id,
        'titulo' => $livro->titulo,
        'isbn' => $livro->isbn,
        'preco' => $livro->preco,
        'year' => $livro->anoEscolar->name ?? 'N/D',
        'tipo' => $livro->tipo,
        'disciplina_id' => $livro->disciplina_id,
        'ano_escolar_id' => $livro->ano_escolar_id,
        'updated_at' => $livro->updated_at?->toISOString(),
        'disciplina' => $livro->disciplina ? [
            'id' => $livro->disciplina->id,
            'nome' => $livro->disciplina->nome,
        ] : null,
    ]);

        // Buscar o ano letivo vigente (atual)
        $anoLetivoVigente = AnoLetivo::whereDate('data_inicio', '<=', now())
            ->whereDate('data_fim', '>=', now())
            ->first();

        // Renderizar a página com os dados iniciais dos filtros
        return Inertia::render('Manuais/Index', [
            'concelhos'         => Concelho::all(['id', 'nome']),
            'escolas'           => Escola::all(['id', 'nome', 'concelho_id']),
            'anos_letivos'      => AnoLetivo::all(['id', 'nome']),
            'anos_escolares'    => AnoEscolar::select('id', 'name as nome')->get(),
            'disciplinas'       => Disciplina::orderBy('nome')->get(['id', 'nome']),
            'ano_letivo_vigente_id' => $anoLetivoVigente?->id,
            'catalog'           => $catalog,
            'filters'           => $request->only(['concelho', 'escola_id', 'ano_letivo_id', 'ano_escolar_id'])
        ]);
    }

    /**
     * Método API para carregar livros de uma lista existente ao filtrar
     */
    public function getListaBooks(Request $request)
    {
        $lista = ListaLivro::where('escola_id', $request->escola_id)
            ->where('ano_letivo_id', $request->ano_letivo_id)
            ->where('ano_escolar_id', $request->ano_escolar_id)
            ->first();

        if ($lista) {
            $items = collect();

            $lista->itens()->with(['manualLivro.anoEscolar', 'manualLivro.disciplina', 'cadernoLivro.anoEscolar', 'cadernoLivro.disciplina'])->get()->each(function($item) use ($items) {
                if ($item->manualLivro) {
                    $items->push([
                        'id' => $item->manualLivro->id,
                        'titulo' => $item->manualLivro->titulo ?? 'Sem título',
                        'isbn' => $item->manualLivro->isbn ?? '',
                        'preco' => $item->manualLivro->preco ?? 0,
                        'year' => $item->manualLivro->anoEscolar->name ?? 'N/D',
                        'tipo' => $item->manualLivro->tipo,
                        'disciplina_id' => $item->manualLivro->disciplina_id,
                        'ano_escolar_id' => $item->manualLivro->ano_escolar_id,
                        'updated_at' => $item->manualLivro->updated_at?->toISOString(),
                        'disciplina' => $item->manualLivro->disciplina ? [
                            'id' => $item->manualLivro->disciplina->id,
                            'nome' => $item->manualLivro->disciplina->nome,
                        ] : null,
                    ]);
                }

                if ($item->cadernoLivro) {
                    $items->push([
                        'id' => $item->cadernoLivro->id,
                        'titulo' => $item->cadernoLivro->titulo ?? 'Sem título',
                        'isbn' => $item->cadernoLivro->isbn ?? '',
                        'preco' => $item->cadernoLivro->preco ?? 0,
                        'year' => $item->cadernoLivro->anoEscolar->name ?? 'N/D',
                        'tipo' => $item->cadernoLivro->tipo,
                        'disciplina_id' => $item->cadernoLivro->disciplina_id,
                        'ano_escolar_id' => $item->cadernoLivro->ano_escolar_id,
                        'updated_at' => $item->cadernoLivro->updated_at?->toISOString(),
                        'disciplina' => $item->cadernoLivro->disciplina ? [
                            'id' => $item->cadernoLivro->disciplina->id,
                            'nome' => $item->cadernoLivro->disciplina->nome,
                        ] : null,
                    ]);
                }
            });

            return response()->json($items->values());
        }

        return response()->json([]);
    }

public function store(Request $request)
{
    \Log::info('=== STORE: Iniciando salvamento ===');
    \Log::info('Request all:', $request->all());
    \Log::info('Items recebidos:', ['items' => $request->items, 'count' => count($request->items ?? [])]);

    // 1. Validar os dados
    $request->validate([
        'escola_id' => 'required|exists:escolas,id',
        'ano_letivo_id' => 'required|exists:anos_letivos,id',
        'ano_escolar_id' => 'required|exists:anos_escolares,id',
        'items' => 'array',
        'precos' => 'array',
        'precos.*.id' => 'required|exists:livros,id',
        'precos.*.preco' => 'nullable|numeric|min:0',
    ]);

    // Atualizar preços dos livros
    if ($request->precos) {
        foreach ($request->precos as $item) {
            if (isset($item['id']) && isset($item['preco'])) {
                Livro::where('id', $item['id'])->update(['preco' => $item['preco']]);
            }
        }
    }

    $lista = ListaLivro::updateOrCreate([
        'escola_id' => $request->escola_id,
        'ano_letivo_id' => $request->ano_letivo_id,
        'ano_escolar_id' => $request->ano_escolar_id,
    ]);

    \Log::info('Lista criada/atualizada:', ['lista_id' => $lista->id]);

    $lista->itens()->delete();

    \Log::info('Itens antigos deletados');

    if ($request->items && count($request->items) > 0) {
        $livros = Livro::whereIn('id', $request->items)->get()->keyBy('id');

        // Agrupar por disciplina_id para juntar manual + caderno na mesma linha
        $porDisciplina = [];
        foreach ($request->items as $livroId) {
            $livro = $livros->get($livroId);
            if (!$livro) continue;

            $discId = $livro->disciplina_id ?? 'sem_disciplina_' . $livroId;

            if (!isset($porDisciplina[$discId])) {
                $porDisciplina[$discId] = [
                    'disciplina_id' => $livro->disciplina_id,
                    'manual_livro_id' => null,
                    'caderno_livro_id' => null,
                ];
            }

            if ($livro->tipo === 'MANUAL') {
                $porDisciplina[$discId]['manual_livro_id'] = $livro->id;
            } elseif ($livro->tipo === 'CADERNO_ATIVIDADES') {
                $porDisciplina[$discId]['caderno_livro_id'] = $livro->id;
            }
        }

        foreach ($porDisciplina as $item) {
            \Log::info('Criando item:', $item);
            $lista->itens()->create([
                'lista_id' => $lista->id,
                'disciplina_id' => $item['disciplina_id'],
                'manual_livro_id' => $item['manual_livro_id'],
                'caderno_livro_id' => $item['caderno_livro_id'],
            ]);
        }

        \Log::info('Total de itens criados:', ['count' => count($porDisciplina)]);
    } else {
        \Log::warning('Nenhum item para salvar!');
    }

    return redirect()->back()->with('success', 'Lista gravada com sucesso!');
}
}