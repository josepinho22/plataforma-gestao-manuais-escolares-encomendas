<?php

namespace Database\Seeders;

use App\Models\AnoEscolar;
use Illuminate\Database\Seeder;

class AnoEscolarSeeder extends Seeder
{
    public function run(): void
    {
        $anosEscolares = [
            '1º Ano',
            '2º Ano',
            '3º Ano',
            '4º Ano',
            '5º Ano',
            '6º Ano',
            '7º Ano',
            '8º Ano',
            '9º Ano',
            '10º Ano',
            '11º Ano',
            '12º Ano',
        ];

        foreach ($anosEscolares as $name) {
            AnoEscolar::create(['name' => $name]);
        }
    }
}
