<?php

namespace Database\Seeders;

use App\Models\Concelho;
use Illuminate\Database\Seeder;

class ConcelhoSeeder extends Seeder
{
    public function run(): void
    {
        $concelhos = [
            'Porto',
            'Vila Nova de Gaia',
            'Matosinhos',
            'Maia',
            'Gondomar',
        ];

        foreach ($concelhos as $nome) {
            Concelho::create(['nome' => $nome]);
        }
    }
}
