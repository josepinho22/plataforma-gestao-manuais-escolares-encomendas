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
            // Agrupar livros relacionados (manual + caderno) juntos
            ->orderByRaw('LEAST(id, IFNULL(livro_relacionado_id, id))')
            // Dentro do grupo, manual primeiro, depois caderno
            ->orderByRaw("FIELD(tipo, 'MANUAL', 'CADERNO_ATIVIDADES')")
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
                'livro_relacionado_id' => $l->livro_relacionado_id,

                'titulo' => $l->titulo,
                'tipo' => $l->tipo,
                'disciplina' => $l->disciplina?->nome ?? '—',
                'ano' => $this->displayAnoEscolar($l->anoEscolar),
                'editora' => $l->editora?->nome ?? '—',
                'isbn' => $l->isbn ?? '—',
                'codigo_interno' => $l->codigo_interno ?? null,
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
            'titulo'         => ['required', 'string', 'max:255'],
            'disciplina_id'  => ['required', 'integer', 'exists:disciplinas,id'],
            'ano_escolar_id' => ['nullable', 'integer', 'exists:anos_escolares,id'],
            'tipo'           => ['required', Rule::in(['manual', 'caderno_atividades'])],
            'preco'          => ['required', 'numeric', 'min:0'],
            'editora_id'     => ['required', 'integer', 'exists:editoras,id'],
            'isbn'           => ['nullable', 'string', 'max:255'],
            'codigo_interno' => ['nullable', 'string', 'max:255'],
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

        if ($isbn === '') {
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
            'titulo'          => ['required', 'string', 'max:255'],
            'disciplina_id'   => ['required', 'integer', 'exists:disciplinas,id'],
            'ano_escolar_id'  => ['nullable', 'integer', 'exists:anos_escolares,id'],
            'tipo'            => ['required', Rule::in(['manual', 'caderno_atividades'])],
            'preco'           => ['required', 'numeric', 'min:0'],
            'editora_id'      => ['required', 'integer', 'exists:editoras,id'],
            'isbn'            => ['required', 'string', 'max:255', Rule::unique('livros', 'isbn')->whereNull('deleted_at')],
            'codigo_interno'  => ['nullable', 'string', 'max:255'],
            'ativo'           => ['required', 'boolean'],

            // Dados do combo (opcionais)
            'vincular_ca'        => ['nullable', 'boolean'],
            'ca_titulo'          => [Rule::requiredIf($request->boolean('vincular_ca')), 'nullable', 'string', 'max:255'],
            'ca_isbn'            => [Rule::requiredIf($request->boolean('vincular_ca')), 'nullable', 'string', 'max:255', Rule::unique('livros', 'isbn')->whereNull('deleted_at')],
            'ca_preco'           => [Rule::requiredIf($request->boolean('vincular_ca')), 'nullable', 'numeric', 'min:0'],
            'ca_codigo_interno'  => ['nullable', 'string', 'max:255'],
        ]);

        // Verificar se o ISBN do manual já existe (incluindo deletados)
        $deletedLivro = Livro::withTrashed()
            ->where('isbn', $data['isbn'])
            ->whereNotNull('deleted_at')
            ->first();

        if ($deletedLivro) {
            $deletedLivro->restore();
            $deletedLivro->update(array_merge($data, ['status_alerta' => 0]));
            $livroManual = $deletedLivro;
            $mensagem = 'Livro restaurado e atualizado com sucesso.';
        } else {
            $livroManual = Livro::create($data);
            $mensagem = 'Livro criado com sucesso.';
        }

        // Se vincular_ca for true, criar também o caderno de atividades
        if ($request->boolean('vincular_ca')) {
            $cadernoData = [
                'titulo'          => $data['ca_titulo'],
                'disciplina_id'   => $data['disciplina_id'],
                'ano_escolar_id'  => $data['ano_escolar_id'],
                'tipo'            => 'caderno_atividades',
                'preco'           => $data['ca_preco'],
                'editora_id'      => $data['editora_id'],
                'isbn'            => $data['ca_isbn'],
                'codigo_interno'  => $data['ca_codigo_interno'] ?? null,
                'ativo'           => true,
            ];

            // Verificar se o ISBN do caderno já existe (incluindo deletados)
            $deletedCaderno = Livro::withTrashed()
                ->where('isbn', $cadernoData['isbn'])
                ->whereNotNull('deleted_at')
                ->first();

            if ($deletedCaderno) {
                $deletedCaderno->restore();
                $deletedCaderno->update(array_merge($cadernoData, ['status_alerta' => 0]));
                $livroCaderno = $deletedCaderno;
            } else {
                $livroCaderno = Livro::create($cadernoData);
            }

            // Criar relação bidirecional entre manual e caderno
            $livroManual->update(['livro_relacionado_id' => $livroCaderno->id]);
            $livroCaderno->update(['livro_relacionado_id' => $livroManual->id]);

            $mensagem = 'Manual e Caderno de Atividades criados e vinculados com sucesso.';
        }

        return redirect()
            ->route('catalogo.livros.index')
            ->with('success', $mensagem);
    }

    public function destroy(Livro $livro)
    {
        // Se o livro tem um relacionado, apagar também
        $livroRelacionadoId = $livro->livro_relacionado_id;

        $livro->delete();

        // Apagar o livro relacionado (se existir)
        if ($livroRelacionadoId) {
            $livroRelacionado = Livro::find($livroRelacionadoId);
            if ($livroRelacionado) {
                $livroRelacionado->delete();
            }
        }

        return redirect()->route('catalogo.livros.index')
            ->with('success', 'Livro(s) removido(s) com sucesso.');
    }
}