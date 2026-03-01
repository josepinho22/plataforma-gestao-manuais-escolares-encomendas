<?php

namespace Database\Seeders;

use App\Models\ListaLivroItem;
use App\Models\ListaLivro;
use App\Models\Livro;
use Illuminate\Database\Seeder;

class ListaLivroItemSeeder extends Seeder
{
    public function run(): void
    {
        $listas = ListaLivro::with('anoEscolar')->get();

        foreach ($listas as $lista) {
            // Evitar duplicados caso o ListaLivroSeeder já tenha criado os itens
            if ($lista->itens()->exists()) {
                continue;
            }

            $livros = Livro::where('ano_escolar_id', $lista->ano_escolar_id)
                ->where('ativo', true)
                ->get();

            if ($livros->isEmpty()) {
                continue;
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
}
