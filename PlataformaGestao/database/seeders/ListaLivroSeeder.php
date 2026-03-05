<?php

namespace Database\Seeders;

use App\Models\ListaLivro;
use App\Models\ListaLivroItem;
use App\Models\Escola;
use App\Models\AnoLetivo;
use App\Models\AnoEscolar;
use App\Models\Livro;
use Illuminate\Database\Seeder;

class ListaLivroSeeder extends Seeder
{
    public function run(): void
    {
        $anoLetivo = AnoLetivo::where('nome', '2025/2026')->first();

        if (! $anoLetivo) {
            return;
        }

        $escolas = Escola::where('isAtivo', true)->get()->keyBy('nome');

        // Escolas Básicas: cobrem 1º–6º Ano
        $escolasBasicas = [
            'Escola Básica João de Deus',
            'Escola Básica de Gaia',
            'Escola Básica de Matosinhos',
            'Escola Básica da Maia',
            'Escola Básica de Gondomar',
        ];
        $anosEB = ['1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano', '6º Ano'];

        // Escolas Secundárias: cobrem 7º–12º Ano
        $escolasSecundarias = [
            'Escola Secundária Rodrigues de Freitas',
            'Escola Secundária de Gaia',
            'Escola Secundária de Matosinhos',
            'Escola Secundária da Maia',
            'Escola Secundária de Gondomar',
        ];
        $anosES = ['7º Ano', '8º Ano', '9º Ano', '10º Ano', '11º Ano', '12º Ano'];

        foreach ($escolasBasicas as $escolaNome) {
            $escola = $escolas[$escolaNome] ?? null;
            if (! $escola) {
                continue;
            }
            foreach ($anosEB as $anoNome) {
                $anoEscolar = AnoEscolar::where('name', $anoNome)->first();
                if (! $anoEscolar) {
                    continue;
                }
                $lista = ListaLivro::create([
                    'escola_id'      => $escola->id,
                    'ano_letivo_id'  => $anoLetivo->id,
                    'ano_escolar_id' => $anoEscolar->id,
                ]);
                $this->criarItens($lista, $anoEscolar->id);
            }
        }

        foreach ($escolasSecundarias as $escolaNome) {
            $escola = $escolas[$escolaNome] ?? null;
            if (! $escola) {
                continue;
            }
            foreach ($anosES as $anoNome) {
                $anoEscolar = AnoEscolar::where('name', $anoNome)->first();
                if (! $anoEscolar) {
                    continue;
                }
                $lista = ListaLivro::create([
                    'escola_id'      => $escola->id,
                    'ano_letivo_id'  => $anoLetivo->id,
                    'ano_escolar_id' => $anoEscolar->id,
                ]);
                $this->criarItens($lista, $anoEscolar->id);
            }
        }
    }

    /**
     * Cria os itens da lista, escolhendo um manual por disciplina.
     * O índice usa escola_id para garantir que escolas diferentes escolhem
     * editoras diferentes para o mesmo ano/disciplina.
     */
    private function criarItens(ListaLivro $lista, int $anoEscolarId): void
    {
        $livros = Livro::where('ano_escolar_id', $anoEscolarId)
            ->where('ativo', true)
            ->get();

        if ($livros->isEmpty()) {
            return;
        }

        foreach ($livros->groupBy('disciplina_id') as $disciplinaId => $livrosDisciplina) {
            $manuais  = $livrosDisciplina->where('tipo', 'MANUAL')->values();
            $cadernos = $livrosDisciplina->where('tipo', 'CADERNO_ATIVIDADES')->values();

            if ($manuais->isEmpty() && $cadernos->isEmpty()) {
                continue;
            }

            $manual  = $manuais->isNotEmpty()
                ? $manuais->get($lista->escola_id % $manuais->count())
                : null;

            $caderno = $cadernos->isNotEmpty()
                ? $cadernos->get($lista->escola_id % $cadernos->count())
                : null;

            ListaLivroItem::create([
                'lista_id'         => $lista->id,
                'disciplina_id'    => $disciplinaId,
                'manual_livro_id'  => $manual?->id,
                'caderno_livro_id' => $caderno?->id,
            ]);
        }
    }
}
