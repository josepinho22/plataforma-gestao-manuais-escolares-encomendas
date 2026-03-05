<?php

namespace Database\Seeders;

use App\Models\StockMovimento;
use App\Models\Livro;
use Illuminate\Database\Seeder;

class StockMovimentoSeeder extends Seeder
{
    // Tipos de movimento: 1 = Entrada, 2 = Saída, 3 = Ajuste
    private const TIPO_ENTRADA = 1;
    private const TIPO_SAIDA = 2;
    private const TIPO_AJUSTE = 3;

    public function run(): void
    {
        $livros = Livro::where('ativo', true)->get();

        $observacoesEntrada = [
            'Receção de encomenda editora',
            'Devolução de cliente',
            'Transferência de armazém',
        ];

        $observacoesSaida = [
            'Venda a cliente',
            'Encomenda de aluno',
            'Devolução a editora',
        ];

        $observacoesAjuste = [
            'Inventário - correção de stock',
            'Livro danificado',
            'Ajuste de sistema',
        ];

        foreach ($livros->take(10) as $livro) {
            // Criar alguns movimentos de exemplo para cada livro

            // Entrada inicial
            StockMovimento::create([
                'livro_id' => $livro->id,
                'tipo' => self::TIPO_ENTRADA,
                'quantidade' => rand(20, 50),
                'observacao' => $observacoesEntrada[array_rand($observacoesEntrada)],
            ]);

            // Algumas saídas
            for ($i = 0; $i < rand(1, 3); $i++) {
                StockMovimento::create([
                    'livro_id' => $livro->id,
                    'tipo' => self::TIPO_SAIDA,
                    'quantidade' => rand(1, 5),
                    'observacao' => $observacoesSaida[array_rand($observacoesSaida)],
                ]);
            }

            // Ocasionalmente um ajuste
            if (rand(0, 1)) {
                StockMovimento::create([
                    'livro_id' => $livro->id,
                    'tipo' => self::TIPO_AJUSTE,
                    'quantidade' => rand(-2, 2),
                    'observacao' => $observacoesAjuste[array_rand($observacoesAjuste)],
                ]);
            }
        }
    }
}
