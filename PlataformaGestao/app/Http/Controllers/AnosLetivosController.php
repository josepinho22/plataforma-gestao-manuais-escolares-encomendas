<?php

namespace App\Http\Controllers;

use App\Models\AnoLetivo;
use App\Models\Livro;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AnosLetivosController extends Controller
{
    public function avancar(Request $request)
    {
        $request->validate([
            'password' => ['required', 'string'],
        ]);

        if (!Hash::check($request->password, $request->user()->password)) {
            return back()->withErrors(['password' => 'Palavra-passe incorreta.']);
        }

        $latest = AnoLetivo::orderByDesc('data_fim')->first();

        if (!$latest) {
            return back()->withErrors(['password' => 'Não existe nenhum ano letivo registado para avançar.']);
        }

        if (!preg_match('/^(\d{4})\/(\d{4})$/', $latest->nome, $matches)) {
            return back()->withErrors(['password' => 'O nome do ano letivo atual não está no formato esperado (ex: 2025/2026).']);
        }

        $y1 = (int) $matches[1] + 1;
        $y2 = (int) $matches[2] + 1;
        $nome = "{$y1}/{$y2}";

        if (AnoLetivo::where('nome', $nome)->exists()) {
            return back()->withErrors(['password' => "O ano letivo {$nome} já existe."]);
        }

        AnoLetivo::create([
            'nome'        => $nome,
            'data_inicio' => $latest->data_inicio->addYear(),
            'data_fim'    => $latest->data_fim->addYear(),
        ]);

        Livro::where('status_alerta', 1)->update(['status_alerta' => 2]);
        Livro::where('status_alerta', 0)->update(['status_alerta' => 1]);

        return redirect()->back()->with('success', "Ano letivo {$nome} criado com sucesso.");
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nome'        => ['required', 'string', 'max:20'],
            'data_inicio' => ['required', 'date'],
            'data_fim'    => ['required', 'date', 'after:data_inicio'],
        ]);

        AnoLetivo::create($data);

        Livro::where('status_alerta', 1)->update(['status_alerta' => 2]);
        Livro::where('status_alerta', 0)->update(['status_alerta' => 1]);

        return redirect()->back()->with('success', 'Ano letivo criado com sucesso.');
    }

    public function update(Request $request, AnoLetivo $anoLetivo)
    {
        $data = $request->validate([
            'nome'        => ['required', 'string', 'max:20'],
            'data_inicio' => ['required', 'date'],
            'data_fim'    => ['required', 'date', 'after:data_inicio'],
        ]);

        $anoLetivo->update($data);

        return redirect()->back()->with('success', 'Ano letivo atualizado com sucesso.');
    }

    public function destroy(AnoLetivo $anoLetivo)
    {
        $anoLetivo->delete();

        return redirect()->back()->with('success', 'Ano letivo removido com sucesso.');
    }
}
