<?php

namespace App\Http\Controllers;

use App\Models\EncomendaAluno;
use App\Models\EncomendaEditora;
use App\Models\AnoLetivo;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $aguardaLivros       = EncomendaAluno::where('status', 'AGUARDA_LIVROS')->count();
        $aguardaEnsacamento  = EncomendaAluno::where('status', 'AGUARDA_ENSACAMENTO')->count();
        $aguardaEncapamento  = EncomendaAluno::where('status', 'AGUARDA_ENCAPAMENTO')->count();
        $aguardaLevantamento = EncomendaAluno::where('status', 'AGUARDA_LEVANTAMENTO')->count();

        $paraEncomendar = EncomendaEditora::where('status', 'SOLICITADO')->count();
        $encomendadas   = EncomendaEditora::where('status', 'ENTREGA_PARCIAL')->count();

        $anosLetivos = AnoLetivo::orderBy('id', 'desc')->get(['id', 'nome']);

        $encapadosPorAno = DB::table('encomenda_livro_aluno_itens as itens')
            ->join('encomendas_aluno as enc', 'itens.encomenda_aluno_id', '=', 'enc.id')
            ->where('itens.encapado', true)
            ->whereNull('itens.deleted_at')
            ->whereNull('enc.deleted_at')
            ->whereNotNull('enc.ano_letivo_id')
            ->groupBy('enc.ano_letivo_id')
            ->select('enc.ano_letivo_id', DB::raw('SUM(itens.quantidade) as total'))
            ->pluck('total', 'ano_letivo_id')
            ->toArray();

        return Inertia::render('Dashboard', [
            'stats' => [
                'aguardaLivros'       => $aguardaLivros,
                'aguardaEnsacamento'  => $aguardaEnsacamento,
                'aguardaEncapamento'  => $aguardaEncapamento,
                'aguardaLevantamento' => $aguardaLevantamento,
                'paraEncomendar'      => $paraEncomendar,
                'encomendadas'        => $encomendadas,
            ],
            'anosLetivos'     => $anosLetivos,
            'encapadosPorAno' => $encapadosPorAno,
        ]);
    }
}
