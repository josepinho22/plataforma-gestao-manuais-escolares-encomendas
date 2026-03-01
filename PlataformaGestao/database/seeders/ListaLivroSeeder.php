<?php

namespace Database\Seeders;

use App\Models\ListaLivro;
use App\Models\ListaLivroItem;
use App\Models\Escola;
use App\Models\AnoLetivo;
use App\Models\AnoEscolar;
use App\Models\Livro;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ListaLivroSeeder extends Seeder
{
    public function run(): void
    {
        $escolas       = Escola::all()->pluck('id', 'nome');
        $anoLetivo2324 = AnoLetivo::where('nome', '2023/2024')->first();
        $anoLetivo2425 = AnoLetivo::where('nome', '2024/2025')->first();
        $anoLetivo2526 = AnoLetivo::where('nome', '2025/2026')->first();

        if (!$anoLetivo2324 || !$anoLetivo2425 || !$anoLetivo2526 || $escolas->isEmpty()) {
            return;
        }

        // Grupos de listas com datas de atualização diferentes
        // Cada entrada: [anoLetivo, anoEscolar (nome), nome da escola, updatedAt]
        $grupos = [
            // ── 5 anos atrás ─────────────────────────────────────────────────
            [$anoLetivo2324, '1º Ano', 'Escola Básica D. Pedro V',         Carbon::now()->subYears(5)],
            [$anoLetivo2324, '2º Ano', 'Escola Básica D. Pedro V',         Carbon::now()->subYears(5)],
            [$anoLetivo2324, '5º Ano', 'Escola Secundária Camões',         Carbon::now()->subYears(5)],
            [$anoLetivo2324, '9º Ano', 'Escola Secundária Camões',         Carbon::now()->subYears(5)],

            // ── 2 anos atrás ─────────────────────────────────────────────────
            [$anoLetivo2324, '1º Ano', 'Escola Básica de Sintra',          Carbon::now()->subYears(2)],
            [$anoLetivo2324, '3º Ano', 'Escola Básica de Sintra',          Carbon::now()->subYears(2)],
            [$anoLetivo2324, '6º Ano', 'Escola Secundária Ferreira Dias',  Carbon::now()->subYears(2)],
            [$anoLetivo2324, '7º Ano', 'Escola Secundária Ferreira Dias',  Carbon::now()->subYears(2)],

            // ── 1 ano atrás ──────────────────────────────────────────────────
            [$anoLetivo2425, '1º Ano',  'Escola Básica de Cascais',        Carbon::now()->subYear()],
            [$anoLetivo2425, '2º Ano',  'Escola Básica de Cascais',        Carbon::now()->subYear()],
            [$anoLetivo2425, '5º Ano',  'Escola Básica D. Pedro V',        Carbon::now()->subYear()],
            [$anoLetivo2425, '8º Ano',  'Escola Secundária Camões',        Carbon::now()->subYear()],
            [$anoLetivo2526, '9º Ano',  'Escola Básica de Sintra',         Carbon::now()->subYear()],
            [$anoLetivo2526, '10º Ano', 'Escola Secundária Ferreira Dias', Carbon::now()->subYear()],
        ];

        foreach ($grupos as [$anoLetivo, $anoEscolarNome, $escolaNome, $updatedAt]) {
            $escolaId   = $escolas[$escolaNome] ?? null;
            $anoEscolar = AnoEscolar::where('name', $anoEscolarNome)->first();

            if (!$escolaId || !$anoEscolar) {
                continue;
            }

            $lista = ListaLivro::create([
                'escola_id'      => $escolaId,
                'ano_letivo_id'  => $anoLetivo->id,
                'ano_escolar_id' => $anoEscolar->id,
            ]);

            // Forçar data de atualização pretendida (bypass do timestamp automático)
            DB::table('listas_livros')->where('id', $lista->id)->update([
                'created_at' => $updatedAt,
                'updated_at' => $updatedAt,
            ]);

            $this->criarItens($lista, $anoEscolar->id);
        }
    }

    private function criarItens(ListaLivro $lista, int $anoEscolarId): void
    {
        $livros = Livro::where('ano_escolar_id', $anoEscolarId)
            ->where('ativo', true)
            ->get();

        if ($livros->isEmpty()) {
            return;
        }

        foreach ($livros->groupBy('disciplina_id') as $disciplinaId => $livrosDisciplina) {
            $manual  = $livrosDisciplina->where('tipo', 'MANUAL')->first();
            $caderno = $livrosDisciplina->where('tipo', 'CADERNO_ATIVIDADES')->first();

            if (!$manual && !$caderno) {
                continue;
            }

            ListaLivroItem::create([
                'lista_id'         => $lista->id,
                'disciplina_id'    => $disciplinaId,
                'manual_livro_id'  => $manual?->id,
                'caderno_livro_id' => $caderno?->id,
            ]);
        }
    }
}
