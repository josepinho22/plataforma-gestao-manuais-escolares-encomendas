<?php

namespace App\Http\Controllers;

use App\Models\Aluno;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AlunosController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string) $request->input('search', ''));

        $query = Aluno::query()->orderBy('nome');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('nome', 'like', "%{$search}%")
                  ->orWhere('nif', 'like', "%{$search}%")
                  ->orWhere('telefone', 'like', "%{$search}%")
                  ->orWhere('numero_cliente', 'like', "%{$search}%");
            });
        }

        $alunos = $query->get()->map(fn ($a) => [
            'id' => $a->id,
            'nome' => $a->nome,
            'nif' => $a->nif ?? '',
            'telefone' => $a->telefone ?? '',
            'email' => $a->email ?? '',
            'id_mega' => $a->id_mega ?? '',
            'numero_cliente' => $a->numero_cliente ?? '',
            'updated_at' => optional($a->updated_at)->format('d/m/Y') ?? '—',
        ]);

        $stats = [
            'total' => Aluno::count(),
        ];

        return Inertia::render('Alunos/Index', [
            'stats' => $stats,
            'alunos' => $alunos,
            'initial' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nome' => ['required', 'string', 'max:255'],
            'nif' => ['nullable', 'string', 'max:30'],
            'telefone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'id_mega' => ['nullable', 'string', 'max:100'],
            'numero_cliente' => ['nullable', 'string', 'max:100'],
        ]);

        Aluno::create($data);

        return redirect()->route('alunos.index')->with('success', 'Aluno criado com sucesso.');
    }

    public function update(Request $request, Aluno $aluno)
    {
        $data = $request->validate([
            'nome' => ['required', 'string', 'max:255'],
            'nif' => ['nullable', 'string', 'max:30'],
            'telefone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'id_mega' => ['nullable', 'string', 'max:100'],
            'numero_cliente' => ['nullable', 'string', 'max:100'],
        ]);

        $aluno->update($data);

        return redirect()->route('alunos.index')->with('success', 'Aluno atualizado com sucesso.');
    }
}