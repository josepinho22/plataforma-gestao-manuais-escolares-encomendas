<?php

namespace Database\Seeders;

use App\Models\ListaLivro;
use App\Models\Escola;
use App\Models\AnoLetivo;
use App\Models\AnoEscolar;
use Illuminate\Database\Seeder;

class ListaLivroSeeder extends Seeder
{
    public function run(): void
    {
        $escolas = Escola::where('isAtivo', true)->get();
        $anoLetivoAtual = AnoLetivo::where('nome', '2024/2025')->first();
        $anosEscolares = AnoEscolar::all();

        // Criar listas para algumas escolas e anos escolares
        $escolasSelecionadas = $escolas->take(5);

        foreach ($escolasSelecionadas as $escola) {
            // Cada escola tem listas para alguns anos escolares
            $anosParaEscola = $anosEscolares->random(rand(3, 6));

            foreach ($anosParaEscola as $anoEscolar) {
                ListaLivro::create([
                    'escola_id' => $escola->id,
                    'ano_letivo_id' => $anoLetivoAtual->id,
                    'ano_escolar_id' => $anoEscolar->id,
                ]);
            }
        }
    }
}
