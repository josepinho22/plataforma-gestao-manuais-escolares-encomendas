<?php

namespace Database\Seeders;

use App\Models\RececaoEditora;
use App\Models\EncomendaEditora;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class RececaoEditoraSeeder extends Seeder
{
    public function run(): void
    {
        // Criar receções para encomendas com entrega parcial ou completa
        $encomendasComEntrega = EncomendaEditora::whereIn('status', ['ENTREGA_PARCIAL', 'ENTREGA_COMPLETA'])->get();

        foreach ($encomendasComEntrega as $encomenda) {
            // Criar 1-2 receções por encomenda
            $numRececoes = $encomenda->status === 'ENTREGA_COMPLETA' ? rand(1, 2) : 1;

            for ($i = 0; $i < $numRececoes; $i++) {
                // Data de receção após a data de solicitação
                $dataRececao = Carbon::parse($encomenda->data_solicitada)
                    ->addDays(rand(3, 10 + ($i * 5)));

                RececaoEditora::create([
                    'encomenda_editora_id' => $encomenda->id,
                    'data_rececao' => $dataRececao,
                ]);
            }
        }
    }
}
