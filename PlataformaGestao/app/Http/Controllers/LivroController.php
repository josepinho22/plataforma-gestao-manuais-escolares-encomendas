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

class LivroController extends Controller
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
        return Inertia::render('Books/Index', [
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
        return response()->json(
    $lista->itens()->with(['manualLivro.anoEscolar'])->get()->map(function($item) {
        return [
            'id' => $item->manual_livro_id,
            'titulo' => $item->manualLivro->titulo ?? 'Sem título',
            'isbn' => $item->manualLivro->isbn ?? '',
            'preco' => $item->manualLivro->preco ?? 0,
            'year' => $item->manualLivro->anoEscolar->name ?? 'N/D',
        ];
    })
);
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
        'items' => 'array'
    ]);

    $lista = ListaLivro::updateOrCreate([
        'escola_id' => $request->escola_id,
        'ano_letivo_id' => $request->ano_letivo_id,
        'ano_escolar_id' => $request->ano_escolar_id,
    ]);

    \Log::info('Lista criada/atualizada:', ['lista_id' => $lista->id]);

    $lista->itens()->delete();

    \Log::info('Itens antigos deletados');

    if ($request->items && count($request->items) > 0) {
        foreach ($request->items as $livroId) {
            \Log::info('Criando item:', ['livro_id' => $livroId]);
            $lista->itens()->create([
                'manual_livro_id' => $livroId,
                'lista_id' => $lista->id
            ]);
        }
        \Log::info('Total de itens criados:', ['count' => count($request->items)]);
    } else {
        \Log::warning('Nenhum item para salvar!');
    }

    return redirect()->back()->with('success', 'Lista gravada com sucesso!');
}
}