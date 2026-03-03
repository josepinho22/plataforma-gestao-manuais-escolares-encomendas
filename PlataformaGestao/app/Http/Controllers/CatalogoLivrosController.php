<?php

namespace App\Http\Controllers;

use App\Models\Livro;
use App\Models\Disciplina;
use App\Models\AnoEscolar;
use App\Models\Editora;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class CatalogoLivrosController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->string('search')->toString();
        $disciplinaId = $request->integer('disciplina_id');
        $anoEscolarId = $request->integer('ano_escolar_id');
        $editoraId = $request->integer('editora_id');
        $tipo = $request->string('tipo')->toString();

        $query = Livro::query()
            ->with(['disciplina', 'anoEscolar', 'editora'])
            ->orderBy('disciplina_id')
            ->orderBy('ano_escolar_id')
            ->orderByRaw("FIELD(tipo, 'manual', 'caderno_atividades')")
            ->orderBy('titulo');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('titulo', 'like', "%{$search}%")
                    ->orWhere('isbn', 'like', "%{$search}%");
            });
        }

        if ($disciplinaId) $query->where('disciplina_id', $disciplinaId);
        if ($anoEscolarId) $query->where('ano_escolar_id', $anoEscolarId);
        if ($editoraId) $query->where('editora_id', $editoraId);
        if ($tipo) $query->where('tipo', $tipo);

        $livros = $query->paginate(20)->withQueryString()->through(function ($l) {
            return [
                'id' => $l->id,

                
                'disciplina_id' => $l->disciplina_id,
                'ano_escolar_id' => $l->ano_escolar_id,
                'editora_id' => $l->editora_id,

                'titulo' => $l->titulo,
                'tipo' => $l->tipo,
                'disciplina' => $l->disciplina?->nome ?? '—',
                'ano' => $this->displayAnoEscolar($l->anoEscolar),
                'editora' => $l->editora?->nome ?? '—',
                'isbn' => $l->isbn ?? '—',
                'preco' => (float) ($l->preco ?? 0),
                'ativo' => (bool) ($l->ativo ?? false),
                'updated_at' => optional($l->updated_at)->format('d/m/Y') ?? '—',
            ];
        });

        $stats = [
            'total' => Livro::count(),
            'ativos' => Livro::where('ativo', 1)->count(),
            'manuais' => Livro::where('tipo', 'manual')->count(),
            'cadernos' => Livro::where('tipo', 'caderno_atividades')->count(),
        ];

        
        $anoLabelColumn = $this->detectLabelColumn('anos_escolares', [
            'ano', 'nome', 'designacao', 'descricao', 'titulo', 'label', 'codigo'
        ]);

        
        if ($anoLabelColumn === 'id') {
            $anos = AnoEscolar::query()
                ->select(['id'])
                ->orderBy('id')
                ->get()
                ->map(fn ($a) => [
                    'id' => $a->id,
                    'label' => (string) $a->id,
                ]);
        } else {
            $anos = AnoEscolar::query()
                ->select(['id', $anoLabelColumn])
                ->orderBy($anoLabelColumn)
                ->get()
                ->map(fn ($a) => [
                    'id' => $a->id,
                    'label' => (string) ($a->{$anoLabelColumn} ?? $a->id),
                ]);
        }

        $filters = [
            'disciplinas' => Disciplina::query()->orderBy('nome')->get(['id', 'nome']),
            'anos' => $anos, 
            'editoras' => Editora::query()->orderBy('nome')->get(['id', 'nome']),
            'tipos' => [
                ['value' => 'manual', 'label' => 'Manual'],
                ['value' => 'caderno_atividades', 'label' => 'CA'],
            ],
        ];

        return Inertia::render('Catalogo/Livros/Index', [
            'stats' => $stats,
            'livros' => $livros,
            'filters' => $filters,
            'initial' => [
                'search' => $search,
                'disciplina_id' => $disciplinaId ?: '',
                'ano_escolar_id' => $anoEscolarId ?: '',
                'editora_id' => $editoraId ?: '',
                'tipo' => $tipo ?: '',
            ],
        ]);
    }

    private function detectLabelColumn(string $table, array $candidates): string
    {
        foreach ($candidates as $col) {
            if (Schema::hasColumn($table, $col)) return $col;
        }
        return 'id';
    }

    private function displayAnoEscolar($anoEscolar): string
    {
        if (!$anoEscolar) return '—';

        foreach (['ano', 'nome', 'designacao', 'descricao', 'titulo', 'label', 'codigo'] as $col) {
            if (isset($anoEscolar->{$col}) && $anoEscolar->{$col} !== null && $anoEscolar->{$col} !== '') {
                return (string) $anoEscolar->{$col};
            }
        }

        return (string) ($anoEscolar->id ?? '—');
    }

    public function update(Request $request, Livro $livro)
    {
        $data = $request->validate([
            'titulo' => ['required', 'string', 'max:255'],
            'disciplina_id' => ['required', 'integer', 'exists:disciplinas,id'],
            'ano_escolar_id' => ['nullable', 'integer', 'exists:anos_escolares,id'],
            'tipo' => ['required', Rule::in(['manual', 'caderno_atividades'])],
            'preco' => ['required', 'numeric', 'min:0'],
            'editora_id' => ['required', 'integer', 'exists:editoras,id'],
            'isbn' => ['nullable', 'string', 'max:255'],
        ]);

        $livro->update(array_merge($data, ['status_alerta' => 0]));

        return redirect()->route('catalogo.livros.index')
            ->with('success', 'Livro atualizado com sucesso.');
    }

    public function toggleActive(Livro $livro)
    {
        $livro->ativo = !$livro->ativo;
        $livro->save();

        return redirect()->route('catalogo.livros.index')
            ->with('success', $livro->ativo ? 'Livro ativado.' : 'Livro tornado inativo.');
    }

    public function checkIsbn(Request $request)
    {
        $isbn = trim($request->string('isbn')->toString());

        if (strlen($isbn) < 5) {
            return response()->json(['livro' => null]);
        }

        $livro = Livro::withTrashed()
            ->where('isbn', $isbn)
            ->with(['disciplina', 'anoEscolar', 'editora'])
            ->first();

        if (!$livro) {
            return response()->json(['livro' => null]);
        }

        return response()->json([
            'livro' => [
                'id'             => $livro->id,
                'titulo'         => $livro->titulo,
                'disciplina_id'  => $livro->disciplina_id,
                'ano_escolar_id' => $livro->ano_escolar_id,
                'editora_id'     => $livro->editora_id,
                'tipo'           => strtolower($livro->tipo),
                'preco'          => (float) $livro->preco,
                'ativo'          => (bool) $livro->ativo,
                'isbn'           => $livro->isbn,
                'deleted'        => $livro->trashed(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titulo'         => ['required', 'string', 'max:255'],
            'disciplina_id'  => ['required', 'integer', 'exists:disciplinas,id'],
            'ano_escolar_id' => ['nullable', 'integer', 'exists:anos_escolares,id'],
            'tipo'           => ['required', Rule::in(['manual', 'caderno_atividades'])],
            'preco'          => ['required', 'numeric', 'min:0'],
            'editora_id'     => ['required', 'integer', 'exists:editoras,id'],
            'isbn'           => ['required', 'string', 'max:255'],
            'ativo'          => ['required', 'boolean'],
        ]);

        $deletedLivro = Livro::withTrashed()
            ->where('isbn', $data['isbn'])
            ->whereNotNull('deleted_at')
            ->first();

        if ($deletedLivro) {
            $deletedLivro->restore();
            $deletedLivro->update(array_merge($data, ['status_alerta' => 0]));

            return redirect()
                ->route('catalogo.livros.index')
                ->with('success', 'Livro restaurado e atualizado com sucesso.');
        }

        Livro::create($data);

        return redirect()
            ->route('catalogo.livros.index')
            ->with('success', 'Livro criado com sucesso.');
    }

    public function destroy(Livro $livro)
    {
        $livro->delete();

        return redirect()->route('catalogo.livros.index')
            ->with('success', 'Livro removido com sucesso.');
    }
}