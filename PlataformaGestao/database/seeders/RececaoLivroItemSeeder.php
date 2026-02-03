<?php

namespace Database\Seeders;

use App\Models\RececaoLivroItem;
use App\Models\RececaoEditora;
use App\Models\EncomendaLivroEditoraItem;
use Illuminate\Database\Seeder;

class RececaoLivroItemSeeder extends Seeder
{
    public function run(): void
    {
        $rececoes = RececaoEditora::with('encomendaEditora')->get();

        foreach ($rececoes as $rececao) {
            // Obter itens da encomenda associada
            $itensEncomenda = EncomendaLivroEditoraItem::where('encomenda_editora_id', $rececao->encomenda_editora_id)
                ->where('qtd_recebida_total', '>', 0)
                ->get();

            foreach ($itensEncomenda as $item) {
                // Distribuir a quantidade recebida pelas receções
                // Simplificação: assumir que toda a quantidade foi recebida nesta receção
                $qtdRecebida = rand(1, (int) $item->qtd_recebida_total);

                RececaoLivroItem::create([
                    'rececao_editora_id' => $rececao->id,
                    'encomenda_editora_item_id' => $item->id,
                    'livro_id' => $item->livro_id,
                    'qtd_recebida' => $qtdRecebida,
                ]);
            }
        }
    }
}
