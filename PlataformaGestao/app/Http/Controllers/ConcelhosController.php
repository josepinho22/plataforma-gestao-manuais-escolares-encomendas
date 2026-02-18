<?php

namespace App\Http\Controllers;

use App\Models\Concelho;
use App\Models\Editora;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConcelhosController extends Controller
{
    public function index(Request $request)
    {
        $concelhosSearch = $request->string('search')->toString();
        $editorasSearch  = $request->string('editoras_search')->toString();

        $concelhosQuery = Concelho::query()->orderBy('nome');
        if ($concelhosSearch) {
            $concelhosQuery->where('nome', 'like', "%{$concelhosSearch}%");
        }

        $editorasQuery = Editora::query()->orderBy('nome');
        if ($editorasSearch) {
            $editorasQuery->where('nome', 'like', "%{$editorasSearch}%");
        }

        return Inertia::render('Gestao/Index', [
            'concelhos' => $concelhosQuery->get(['id', 'nome']),
            'editoras'  => $editorasQuery->get(['id', 'nome']),
            'initial' => [
                'concelhos_search' => $concelhosSearch,
                'editoras_search'  => $editorasSearch,
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