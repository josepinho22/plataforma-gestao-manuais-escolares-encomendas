<?php

namespace App\Http\Controllers;

use App\Models\AnoLetivo;
use App\Models\Concelho;
use App\Models\Disciplina;
use App\Models\Editora;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConcelhosController extends Controller
{
    public function index(Request $request)
    {
        $concelhosSearch    = $request->string('search')->toString();
        $editorasSearch     = $request->string('editoras_search')->toString();
        $disciplinasSearch  = $request->string('disciplinas_search')->toString();
        $anosLetivosSearch  = $request->string('anos_letivos_search')->toString();

        $concelhosQuery = Concelho::query()->orderBy('nome');
        if ($concelhosSearch) {
            $concelhosQuery->where('nome', 'like', "%{$concelhosSearch}%");
        }

        $editorasQuery = Editora::query()->orderBy('nome');
        if ($editorasSearch) {
            $editorasQuery->where('nome', 'like', "%{$editorasSearch}%");
        }

        $disciplinasQuery = Disciplina::query()->orderBy('nome');
        if ($disciplinasSearch) {
            $disciplinasQuery->where('nome', 'like', "%{$disciplinasSearch}%");
        }

        $anosLetivosQuery = AnoLetivo::query()->orderByDesc('data_inicio');
        if ($anosLetivosSearch) {
            $anosLetivosQuery->where('nome', 'like', "%{$anosLetivosSearch}%");
        }

        return Inertia::render('Gestao/Index', [
            'concelhos'    => $concelhosQuery->get(['id', 'nome']),
            'editoras'     => $editorasQuery->get(['id', 'nome']),
            'disciplinas'  => $disciplinasQuery->get(['id', 'nome']),
            'anosLetivos'  => $anosLetivosQuery->get(['id', 'nome', 'data_inicio', 'data_fim']),
            'initial' => [
                'concelhos_search'   => $concelhosSearch,
                'editoras_search'    => $editorasSearch,
                'disciplinas_search' => $disciplinasSearch,
                'anos_letivos_search' => $anosLetivosSearch,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nome' => ['required', 'string', 'max:255'],
        ]);

        Concelho::create($data);

        return redirect()->back()->with('success', 'Concelho criado com sucesso.');
    }

    public function update(Request $request, Concelho $concelho)
    {
        $data = $request->validate([
            'nome' => ['required', 'string', 'max:255'],
        ]);

        $concelho->update($data);

        return redirect()->back()->with('success', 'Concelho atualizado com sucesso.');
    }

    public function destroy(Concelho $concelho)
    {
        $concelho->delete();

        return redirect()->back()->with('success', 'Concelho removido com sucesso.');
    }
}