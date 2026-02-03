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
            // Lisboa
            [
                'nome' => 'Escola Básica D. Pedro V',
                'codigo' => 'EB-DPV',
                'concelho_id' => $concelhos['Lisboa'],
                'isAtivo' => true,
            ],
            [
                'nome' => 'Escola Secundária Camões',
                'codigo' => 'ES-CAM',
                'concelho_id' => $concelhos['Lisboa'],
                'isAtivo' => true,
            ],
            // Sintra
            [
                'nome' => 'Escola Básica de Sintra',
                'codigo' => 'EB-SNT',
                'concelho_id' => $concelhos['Sintra'],
                'isAtivo' => true,
            ],
            [
                'nome' => 'Escola Secundária Ferreira Dias',
                'codigo' => 'ES-FD',
                'concelho_id' => $concelhos['Sintra'],
                'isAtivo' => true,
            ],
            // Cascais
            [
                'nome' => 'Escola Básica de Cascais',
                'codigo' => 'EB-CAS',
                'concelho_id' => $concelhos['Cascais'],
                'isAtivo' => true,
            ],
            [
                'nome' => 'Escola Secundária de Cascais',
                'codigo' => 'ES-CAS',
                'concelho_id' => $concelhos['Cascais'],
                'isAtivo' => true,
            ],
            // Oeiras
            [
                'nome' => 'Escola Básica Sophia de Mello Breyner',
                'codigo' => 'EB-SMB',
                'concelho_id' => $concelhos['Oeiras'],
                'isAtivo' => true,
            ],
            // Amadora
            [
                'nome' => 'Escola Secundária da Amadora',
                'codigo' => 'ES-AMD',
                'concelho_id' => $concelhos['Amadora'],
                'isAtivo' => true,
            ],
            // Loures
            [
                'nome' => 'Escola Básica de Loures',
                'codigo' => 'EB-LRS',
                'concelho_id' => $concelhos['Loures'],
                'isAtivo' => true,
            ],
            // Almada
            [
                'nome' => 'Escola Secundária Fernão Mendes Pinto',
                'codigo' => 'ES-FMP',
                'concelho_id' => $concelhos['Almada'],
                'isAtivo' => true,
            ],
            // Escola inativa para teste
            [
                'nome' => 'Escola Básica Antiga (Desativada)',
                'codigo' => 'EB-ANT',
                'concelho_id' => $concelhos['Lisboa'],
                'isAtivo' => false,
            ],
        ];

        foreach ($escolas as $escola) {
            Escola::create($escola);
        }
    }
}
