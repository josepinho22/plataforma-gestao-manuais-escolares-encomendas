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
    ]);

        // Renderizar a página com os dados iniciais dos filtros
        return Inertia::render('Books/Index', [
            'concelhos'      => Concelho::all(['id', 'nome']),
            'escolas'        => Escola::all(['id', 'nome', 'concelho_id']), 
            'anos_letivos'   => AnoLetivo::all(['id', 'nome']),
            'anos_escolares' => AnoEscolar::select('id', 'name as nome')->get(),
            'catalog'        => $catalog,
            'filters'        => $request->only(['concelho', 'escola_id', 'ano_letivo_id', 'ano_escolar_id'])
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
    $lista->itens()->with('manualLivro')->get()->map(function($item) {
        return [
            'id' => $item->manual_livro_id, 
            'titulo' => $item->manualLivro->titulo ?? 'Sem título',
            'year' => $item->manualLivro->anoEscolar->name ?? 'N/D',
        ];
    })
);
    }
    return response()->json([]);
}

public function store(Request $request)
{
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


    $lista->itens()->delete();

    foreach ($request->items as $livroId) {
        $lista->itens()->create([
            'manual_livro_id' => $livroId, 
            'lista_id' => $lista->id 
        ]);
    }
    return redirect()->back()->with('success', 'Lista gravada com sucesso!');
}
}