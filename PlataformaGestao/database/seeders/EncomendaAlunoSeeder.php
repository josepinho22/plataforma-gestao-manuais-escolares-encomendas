<?php

namespace Database\Seeders;

use App\Models\EncomendaAluno;
use App\Models\Aluno;
use App\Models\Escola;
use App\Models\AnoLetivo;
use App\Models\AnoEscolar;
use App\Models\ListaLivro;
use Illuminate\Database\Seeder;

class EncomendaAlunoSeeder extends Seeder
{
    public function run(): void
    {
        $alunos = Aluno::all();
        $anoLetivoAtual = AnoLetivo::where('nome', '2024/2025')->first();
        $escolas = Escola::where('isAtivo', true)->get();

        $observacoes = [
            null,
            'Cliente solicita urgência',
            'Livros para irmãos',
            'Aguardar contacto telefónico',
            'Encapar todos os livros',
        ];

        foreach ($alunos as $index => $aluno) {
            // Escolher uma escola e ano escolar aleatório
            $escola = $escolas->random();
            $anoEscolar = AnoEscolar::inRandomOrder()->first();

            // Tentar encontrar uma lista para essa combinação
            $lista = ListaLivro::where('escola_id', $escola->id)
                ->where('ano_letivo_id', $anoLetivoAtual->id)
                ->where('ano_escolar_id', $anoEscolar->id)
                ->first();

            EncomendaAluno::create([
                'aluno_id' => $aluno->id,
                'nif' => $aluno->nif,
                'id_mega' => $aluno->id_mega,
                'nome' => $aluno->nome,
                'telefone' => $aluno->telefone,
                'escola_id' => $escola->id,
                'ano_letivo_id' => $anoLetivoAtual->id,
                'ano_escolar_id' => $anoEscolar->id,
                'lista_id' => $lista?->id,
                'observacao' => $observacoes[array_rand($observacoes)],
            ]);
        }
    }
}
