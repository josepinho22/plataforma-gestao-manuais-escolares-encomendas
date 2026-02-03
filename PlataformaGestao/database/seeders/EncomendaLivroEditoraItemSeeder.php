<?php

namespace Database\Seeders;

use App\Models\EncomendaLivroEditoraItem;
use App\Models\EncomendaEditora;
use App\Models\Livro;
use Illuminate\Database\Seeder;

class EncomendaLivroEditoraItemSeeder extends Seeder
{
    public function run(): void
    {
        $encomendas = EncomendaEditora::with('editora')->get();

        foreach ($encomendas as $encomenda) {
            // Obter livros desta editora
            $livrosEditora = Livro::where('editora_id', $encomenda->editora_id)
                ->where('ativo', true)
                ->get();

            if ($livrosEditora->isEmpty()) {
                continue;
            }

            // Encomendar alguns livros aleatórios
            $livrosSelecionados = $livrosEditora->random(min(3, $livrosEditora->count()));

            foreach ($livrosSelecionados as $livro) {
                $qtdSolicitada = rand(10, 50);

                // Calcular quantidade recebida baseado no status
                $qtdRecebida = match ($encomenda->status) {
                    'ENTREGA_COMPLETA' => $qtdSolicitada,
                    'ENTREGA_PARCIAL' => rand(1, $qtdSolicitada - 1),
                    'SOLICITADO' => 0,
                };

                EncomendaLivroEditoraItem::create([
                    'encomenda_editora_id' => $encomenda->id,
                    'livro_id' => $livro->id,
                    'qtd_solicitada' => $qtdSolicitada,
                    'qtd_recebida_total' => $qtdRecebida,
                ]);
            }
        }
    }
}
