<?php

namespace App\Http\Controllers;

use App\Models\Escola;
use App\Models\Concelho;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EscolasController extends Controller
{
    public function create()
    {
        $concelhos = Concelho::query()
            ->orderBy('nome')
            ->get(['id', 'nome']);

        return Inertia::render('Escolas/Create', [
            'concelhos' => $concelhos,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'concelho_id' => ['nullable', 'integer', 'exists:concelhos,id'],
            'nome'        => ['required', 'string', 'max:255'],
            'codigo'      => [
                'required',
                'string',
                'max:100',
                Rule::unique('escolas', 'codigo')->whereNull('deleted_at'),
            ],
            'isAtivo'     => ['required', 'boolean'],
        ]);

        Escola::create($data);

return redirect()
    ->route('escolas.index')
    ->with('success', 'Escola adicionada com sucesso.');
}

    public function index(Request $request)
{
    $search = $request->string('search')->toString();
    $concelhoId = $request->integer('concelho_id');
    $estado = $request->string('estado')->toString();

    $query = Escola::query()
        ->with(['concelho']);

    if ($search) {
        $query->where(function ($q) use ($search) {
            $q->where('nome', 'like', "%{$search}%")
              ->orWhere('codigo', 'like', "%{$search}%");
        });
    }

    if ($concelhoId) $query->where('concelho_id', $concelhoId);
    if ($estado === 'ATIVO') $query->where('isAtivo', true);
    if ($estado === 'INATIVO') $query->where('isAtivo', false);

    $escolas = $query
        ->orderBy('nome')
        ->orderBy('codigo')
        ->get()
        ->map(fn ($e) => [
            'id' => $e->id,
            'concelho_id' => $e->concelho_id,
            'concelho' => $e->concelho?->nome ?? '—',
            'nome' => $e->nome,
            'codigo' => $e->codigo,
            'isAtivo' => (bool) $e->isAtivo,
            'updated_at' => optional($e->updated_at)->format('d/m/Y') ?? '—',
        ]);

    $stats = [
        'total' => Escola::count(),
        'ativas' => Escola::where('isAtivo', true)->count(),
        'inativas' => Escola::where('isAtivo', false)->count(),
    ];

    $concelhos = Concelho::query()->orderBy('nome')->get(['id', 'nome']);

    return Inertia::render('Escolas/Index', [
        'stats' => $stats,
        'escolas' => $escolas,
        'filters' => [
            'concelhos' => $concelhos,
            'estados' => [
                ['value' => 'ALL', 'label' => 'Todas'],
                ['value' => 'ATIVO', 'label' => 'Ativas'],
                ['value' => 'INATIVO', 'label' => 'Inativas'],
            ],
        ],
        'initial' => [
            'search' => $search,
            'concelho_id' => $concelhoId ?: '',
            'estado' => $estado ?: 'ALL',
        ],
    ]);
}

    public function update(Request $request, Escola $escola)
    {
        $data = $request->validate([
            'concelho_id' => ['nullable', 'integer', 'exists:concelhos,id'],
            'nome' => ['required', 'string', 'max:255'],
            'codigo' => [
                'required',
                'string',
                'max:100',
                Rule::unique('escolas', 'codigo')
                    ->whereNull('deleted_at')
                    ->ignore($escola->id),
            ],
            'isAtivo' => ['required', 'boolean'],
        ]);

        $escola->update($data);

        return redirect()
            ->route('escolas.index')
            ->with('success', 'Escola atualizada com sucesso.');
    }

    public function toggleActive(Escola $escola)
    {
        $escola->isAtivo = !$escola->isAtivo;
        $escola->save();

        return redirect()
            ->route('escolas.index')
            ->with('success', $escola->isAtivo ? 'Escola ativada.' : 'Escola inativada.');
    }

    public function destroy(Escola $escola)
    {
        $escola->delete();

        return redirect()
            ->route('escolas.index')
            ->with('success', 'Escola removida com sucesso.');
    }
}