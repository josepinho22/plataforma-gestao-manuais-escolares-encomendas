<?php

namespace App\Http\Controllers;

use App\Models\Livro;
use App\Models\Stock;
use App\Models\StockMovimento;
use App\Models\Disciplina;
use App\Models\Editora;
use App\Models\AnoEscolar;
use App\Models\EncomendaAluno;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class StockController extends Controller
{
    public function index(Request $request)
    {

        // Build necessario as a grouped subquery (not correlated)
        // Aggregates remaining quantity per livro_id for non-ensacado items
        $necessarioQuery = DB::table('encomenda_livro_aluno_itens as elai')
            ->select([
                'elai.livro_id',
                DB::raw('COALESCE(SUM(
                    CASE WHEN (elai.quantidade - elai.quantidade_entregue) > 0
                         THEN (elai.quantidade - elai.quantidade_entregue)
                         ELSE 0 END
                ), 0) as necessario')
            ])
            ->join('encomendas_aluno as ea', 'ea.id', '=', 'elai.encomenda_aluno_id')
            ->where('elai.ensacado', 0)
            ->where('ea.status', '!=', 'ENTREGUE')
            ->whereNull('elai.deleted_at')
            ->whereNull('ea.deleted_at')
            ->groupBy('elai.livro_id');

        $query = Livro::query()
            ->select([
                'livros.id as livro_id',
                'livros.titulo',
                'livros.isbn',
                'livros.ano_escolar_id',
                'disciplinas.nome as disciplina_nome',
                'editoras.nome as editora_nome',
                'livros.codigo_interno',
                DB::raw('COALESCE(stocks.quantidade, 0) as stock_qtd'),
                DB::raw('COALESCE(necessario_sub.necessario, 0) as necessario'),
            ])
            ->leftJoin('stocks', function ($join) {
                $join->on('stocks.livro_id', '=', 'livros.id')
                    ->whereNull('stocks.deleted_at');
            })
            ->leftJoinSub($necessarioQuery, 'necessario_sub', function ($join) {
                $join->on('livros.id', '=', 'necessario_sub.livro_id');
            })
            ->leftJoin('disciplinas', 'disciplinas.id', '=', 'livros.disciplina_id')
            ->leftJoin('editoras', 'editoras.id', '=', 'livros.editora_id')
            ->where(function ($q) {
                $q->where('stocks.quantidade', '>', 0)
                    ->orWhere('necessario_sub.necessario', '>', 0);
            });

        // Filters
        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(function ($wq) use ($q) {
                $wq->where('livros.titulo', 'like', '%' . $q . '%')
                    ->orWhere('livros.isbn', 'like', '%' . $q . '%');
            });
        }

        if ($request->filled('disciplina_id')) {
            $query->where('livros.disciplina_id', $request->disciplina_id);
        }

        if ($request->filled('editora_id')) {
            $query->where('livros.editora_id', $request->editora_id);
        }

        if ($request->filled('ano_escolar_id')) {
            $query->where('livros.ano_escolar_id', $request->ano_escolar_id);
        }



        $items = $query->paginate(20)->withQueryString();

        // Calculate total in stock across all books
        $totalInStock = DB::table('stocks')
            ->whereNull('deleted_at')
            ->sum('quantidade');

        // Fetch dropdown options
        $disciplinas = Disciplina::orderBy('nome')->get(['id', 'nome']);
        $editoras = Editora::orderBy('nome')->get(['id', 'nome']);
        $anosEscolares = AnoEscolar::orderBy('id')->get(['id', 'name']);

        return Inertia::render('Stock/Index', [
            'items' => $items,
            'totalInStock' => $totalInStock,
            'filters' => $request->only(['q', 'disciplina_id', 'editora_id', 'ano_escolar_id']),
            'disciplinas' => $disciplinas,
            'editoras' => $editoras,
            'anosEscolares' => $anosEscolares,
        ]);
    }

    public function adjust(Request $request)
    {
        $request->validate([
            'livro_id' => 'required|exists:livros,id',
            'operacao' => 'required|in:ADICIONAR,REMOVER',
            'quantidade' => 'required|integer|min:1',

        ]);

        $livroId = $request->livro_id;
        $operacao = $request->operacao;
        $quantidade = $request->quantidade;

        $stock = Stock::firstOrNew(
            ['livro_id' => $livroId],
            ['quantidade' => 0]
        );

        if ($operacao === 'REMOVER' && $stock->quantidade < $quantidade) {
            throw ValidationException::withMessages([
                'quantidade' => 'Stock insuficiente. Stock atual: ' . $stock->quantidade,
            ]);
        }

        DB::transaction(function () use ($stock, $operacao, $quantidade, $livroId, $request) {
            if ($operacao === 'REMOVER') {
                $stock->quantidade -= $quantidade;
            } else {
                $stock->quantidade += $quantidade;
            }

            $stock->save();

            StockMovimento::create([
                'livro_id' => $livroId,
                'tipo' => $operacao === 'ADICIONAR' ? 1 : 2,
                'quantidade' => $quantidade,

            ]);
        });

        // Recalcular status das encomendas afetadas por este livro
        EncomendaAluno::recalculateForBook($livroId);

        return back();
    }

    public function add(Request $request)
    {
        $request->validate([
            'livro_id' => 'required|exists:livros,id',
            'quantidade' => 'required|integer|min:1',
        ]);

        $livroId = $request->livro_id;
        $quantidade = $request->quantidade;

        DB::transaction(function () use ($livroId, $quantidade) {
            $stock = Stock::where('livro_id', $livroId)->lockForUpdate()->first();

            if ($stock) {
                $stock->quantidade += $quantidade;
                $stock->save();
            } else {
                Stock::create([
                    'livro_id' => $livroId,
                    'quantidade' => $quantidade,
                ]);
            }

            StockMovimento::create([
                'livro_id' => $livroId,
                'tipo' => 1,
                'quantidade' => $quantidade,
            ]);
        });

        // Recalcular status das encomendas afetadas por este livro
        EncomendaAluno::recalculateForBook($livroId);

        return back();
    }
}
