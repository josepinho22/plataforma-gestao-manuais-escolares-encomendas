<?php

namespace App\Http\Controllers;

use App\Models\Disciplina;
use Illuminate\Http\Request;

class DisciplinasController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'nome' => ['required', 'string', 'max:255'],
        ]);

        Disciplina::create($data);

        return redirect()->back()->with('success', 'Disciplina criada com sucesso.');
    }

    public function update(Request $request, Disciplina $disciplina)
    {
        $data = $request->validate([
            'nome' => ['required', 'string', 'max:255'],
        ]);

        $disciplina->update($data);

        return redirect()->back()->with('success', 'Disciplina atualizada com sucesso.');
    }

    public function destroy(Disciplina $disciplina)
    {
        $disciplina->delete();

        return redirect()->back()->with('success', 'Disciplina removida com sucesso.');
    }
}
