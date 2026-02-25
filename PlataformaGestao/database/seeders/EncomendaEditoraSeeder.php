<?php

namespace Database\Seeders;

use App\Models\EncomendaEditora;
use App\Models\Editora;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class EncomendaEditoraSeeder extends Seeder
{
    public function run(): void
    {
        $editoras = Editora::all();

        $encomendas = [
            // Porto Editora - várias encomendas
            [
                'editora_id' => $editoras->where('nome', 'Porto Editora')->first()->id,
                'status' => 'ENTREGA_COMPLETA',
                'data_solicitada' => Carbon::now()->subDays(30),
            ],
            [
                'editora_id' => $editoras->where('nome', 'Porto Editora')->first()->id,
                'status' => 'ENTREGA_PARCIAL',
                'data_solicitada' => Carbon::now()->subDays(15),
            ],
            [
                'editora_id' => $editoras->where('nome', 'Porto Editora')->first()->id,
                'status' => 'SOLICITADO',
                'data_solicitada' => Carbon::now()->subDays(3),
            ],

            // Texto Editores
            [
                'editora_id' => $editoras->where('nome', 'Texto Editores')->first()->id,
                'status' => 'ENTREGA_COMPLETA',
                'data_solicitada' => Carbon::now()->subDays(25),
            ],
            [
                'editora_id' => $editoras->where('nome', 'Texto Editores')->first()->id,
                'status' => 'SOLICITADO',
                'data_solicitada' => Carbon::now()->subDays(5),
            ],

            // Leya
            [
                'editora_id' => $editoras->where('nome', 'Leya Educação')->first()->id,
                'status' => 'ENTREGA_PARCIAL',
                'data_solicitada' => Carbon::now()->subDays(20),
            ],

            // Areal Editores
            [
                'editora_id' => $editoras->where('nome', 'Areal Editores')->first()->id,
                'status' => 'ENTREGA_COMPLETA',
                'data_solicitada' => Carbon::now()->subDays(40),
            ],

            // Santillana
            [
                'editora_id' => $editoras->where('nome', 'Santillana')->first()->id,
                'status' => 'SOLICITADO',
                'data_solicitada' => Carbon::now()->subDays(2),
            ],

            // Raiz Editora
            [
                'editora_id' => $editoras->where('nome', 'Raiz Editora')->first()->id,
                'status' => 'ENTREGA_COMPLETA',
                'data_solicitada' => Carbon::now()->subDays(35),
            ],
        ];

        foreach ($encomendas as $encomenda) {
            EncomendaEditora::create($encomenda);
        }
    }
}
