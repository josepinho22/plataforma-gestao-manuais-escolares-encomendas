<?php

namespace App\Http\Controllers;

use App\Models\Editora;
use Illuminate\Http\Request;

class EditorasController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'nome' => ['required', 'string', 'max:255'],
        ]);

        Editora::create($data);

        return redirect()->back()->with('success', 'Editora criada com sucesso.');
    }

    public function update(Request $request, Editora $editora)
    {
        $data = $request->validate([
            'nome' => ['required', 'string', 'max:255'],
        ]);

        $editora->update($data);

        return redirect()->back()->with('success', 'Editora atualizada com sucesso.');
    }

    public function destroy(Editora $editora)
    {
        $editora->delete();

        return redirect()->back()->with('success', 'Editora removida com sucesso.');
    }
}