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
        $anoLetivo = AnoLetivo::where('nome', '2025/2026')->first();
        $alunos    = Aluno::orderBy('id')->get();

        // Cada aluno → [escola, ano escolar, observação]
        $dados = [
            ['Escola Básica João de Deus',             '5º Ano',  null],
            ['Escola Secundária Rodrigues de Freitas', '7º Ano',  'Cliente solicita urgência'],
            ['Escola Secundária de Matosinhos',        '9º Ano',  'Encapar todos os livros'],
            ['Escola Básica da Maia',                  '1º Ano',  null],
            ['Escola Secundária de Gondomar',          '11º Ano', 'Aguardar contacto telefónico'],
        ];

        foreach ($alunos as $index => $aluno) {
            [$escolaNome, $anoEscolarNome, $observacao] = $dados[$index];

            $escola     = Escola::where('nome', $escolaNome)->first();
            $anoEscolar = AnoEscolar::where('name', $anoEscolarNome)->first();

            $lista = ListaLivro::where('escola_id', $escola->id)
                ->where('ano_letivo_id', $anoLetivo->id)
                ->where('ano_escolar_id', $anoEscolar->id)
                ->first();

            EncomendaAluno::create([
                'aluno_id'       => $aluno->id,
                'nif'            => $aluno->nif,
                'id_mega'        => $aluno->id_mega,
                'nome'           => $aluno->nome,
                'telefone'       => $aluno->telefone,
                'escola_id'      => $escola->id,
                'ano_letivo_id'  => $anoLetivo->id,
                'ano_escolar_id' => $anoEscolar->id,
                'lista_id'       => $lista?->id,
                'status'         => 'AGUARDA_LIVROS',
                'observacao'     => $observacao,
            ]);
        }
    }
}
