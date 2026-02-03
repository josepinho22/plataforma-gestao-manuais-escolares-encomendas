<?php

namespace Database\Seeders;

use App\Models\ListaLivroItem;
use App\Models\ListaLivro;
use App\Models\Disciplina;
use App\Models\Livro;
use Illuminate\Database\Seeder;

class ListaLivroItemSeeder extends Seeder
{
    public function run(): void
    {
        $listas = ListaLivro::with('anoEscolar')->get();
        $disciplinas = Disciplina::all();

        foreach ($listas as $lista) {
            // Obter livros do mesmo ano escolar
            $livrosAnoEscolar = Livro::where('ano_escolar_id', $lista->ano_escolar_id)
                ->where('ativo', true)
                ->get();

            if ($livrosAnoEscolar->isEmpty()) {
                continue;
            }

            // Agrupar livros por disciplina
            $livrosPorDisciplina = $livrosAnoEscolar->groupBy('disciplina_id');

            foreach ($livrosPorDisciplina as $disciplinaId => $livros) {
                $manual = $livros->where('tipo', 'MANUAL')->first();
                $caderno = $livros->where('tipo', 'CADERNO_ATIVIDADES')->first();

                // Só criar item se existir pelo menos um livro
                if ($manual || $caderno) {
                    ListaLivroItem::create([
                        'lista_id' => $lista->id,
                        'disciplina_id' => $disciplinaId,
                        'manual_livro_id' => $manual?->id,
                        'caderno_livro_id' => $caderno?->id,
                    ]);
                }
            }
        }
    }
}
