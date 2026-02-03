<?php

namespace Database\Seeders;

use App\Models\Concelho;
use Illuminate\Database\Seeder;

class ConcelhoSeeder extends Seeder
{
    public function run(): void
    {
        // Concelhos do distrito de Lisboa e arredores
        $concelhos = [
            'Lisboa',
            'Sintra',
            'Cascais',
            'Oeiras',
            'Amadora',
            'Loures',
            'Odivelas',
            'Vila Franca de Xira',
            'Mafra',
            'Torres Vedras',
            'Alenquer',
            'Almada',
            'Seixal',
            'Setúbal',
            'Barreiro',
            'Montijo',
            'Palmela',
            'Sesimbra',
            'Moita',
            'Alcochete',
        ];

        foreach ($concelhos as $nome) {
            Concelho::create(['nome' => $nome]);
        }
    }
}
