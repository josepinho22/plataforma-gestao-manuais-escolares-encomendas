<?php

namespace Database\Seeders;

use App\Models\Escola;
use App\Models\Concelho;
use Illuminate\Database\Seeder;

class EscolaSeeder extends Seeder
{
    public function run(): void
    {
        $concelhos = Concelho::all()->pluck('id', 'nome');

        $escolas = [
            // Porto
            [
                'nome'        => 'Escola Básica João de Deus',
                'codigo'      => 'EB-JD',
                'concelho_id' => $concelhos['Porto'],
                'isAtivo'     => true,
            ],
            [
                'nome'        => 'Escola Secundária Rodrigues de Freitas',
                'codigo'      => 'ES-RF',
                'concelho_id' => $concelhos['Porto'],
                'isAtivo'     => true,
            ],
            // Vila Nova de Gaia
            [
                'nome'        => 'Escola Básica de Gaia',
                'codigo'      => 'EB-GAI',
                'concelho_id' => $concelhos['Vila Nova de Gaia'],
                'isAtivo'     => true,
            ],
            [
                'nome'        => 'Escola Secundária de Gaia',
                'codigo'      => 'ES-GAI',
                'concelho_id' => $concelhos['Vila Nova de Gaia'],
                'isAtivo'     => true,
            ],
            // Matosinhos
            [
                'nome'        => 'Escola Básica de Matosinhos',
                'codigo'      => 'EB-MAT',
                'concelho_id' => $concelhos['Matosinhos'],
                'isAtivo'     => true,
            ],
            [
                'nome'        => 'Escola Secundária de Matosinhos',
                'codigo'      => 'ES-MAT',
                'concelho_id' => $concelhos['Matosinhos'],
                'isAtivo'     => true,
            ],
            // Maia
            [
                'nome'        => 'Escola Básica da Maia',
                'codigo'      => 'EB-MAI',
                'concelho_id' => $concelhos['Maia'],
                'isAtivo'     => true,
            ],
            [
                'nome'        => 'Escola Secundária da Maia',
                'codigo'      => 'ES-MAI',
                'concelho_id' => $concelhos['Maia'],
                'isAtivo'     => true,
            ],
            // Gondomar
            [
                'nome'        => 'Escola Básica de Gondomar',
                'codigo'      => 'EB-GON',
                'concelho_id' => $concelhos['Gondomar'],
                'isAtivo'     => true,
            ],
            [
                'nome'        => 'Escola Secundária de Gondomar',
                'codigo'      => 'ES-GON',
                'concelho_id' => $concelhos['Gondomar'],
                'isAtivo'     => true,
            ],
        ];

        foreach ($escolas as $escola) {
            Escola::create($escola);
        }
    }
}
