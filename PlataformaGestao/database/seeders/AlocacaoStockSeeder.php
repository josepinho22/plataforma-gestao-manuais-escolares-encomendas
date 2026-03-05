<?php

namespace Database\Seeders;

use App\Models\AlocacaoStock;
use App\Models\RececaoLivroItem;
use App\Models\EncomendaLivroAlunoItem;
use Illuminate\Database\Seeder;

class AlocacaoStockSeeder extends Seeder
{
    public function run(): void
    {
        // Obter itens de encomenda de aluno que já foram entregues ou ensacados
        $itensAlunoEntregues = EncomendaLivroAlunoItem::whereHas('encomendaAluno', function ($query) {
            $query->whereIn('status', ['AGUARDA_LEVANTAMENTO', 'ENTREGUE']);
        })->get();

        foreach ($itensAlunoEntregues as $itemAluno) {
            // Tentar encontrar uma receção com este livro
            $rececaoItem = RececaoLivroItem::where('livro_id', $itemAluno->livro_id)
                ->inRandomOrder()
                ->first();

            if ($rececaoItem) {
                AlocacaoStock::create([
                    'livro_id' => $itemAluno->livro_id,
                    'rececao_editora_item_id' => $rececaoItem->id,
                    'encomenda_aluno_item_id' => $itemAluno->id,
                    'quantidade_alocada' => $itemAluno->quantidade,
                ]);
            }
        }
    }
}
