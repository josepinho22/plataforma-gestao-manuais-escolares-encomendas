<?php

namespace Database\Seeders;

use App\Models\AnoLetivo;
use Illuminate\Database\Seeder;

class AnoLetivoSeeder extends Seeder
{
    public function run(): void
    {
        AnoLetivo::create([
            'nome'        => '2025/2026',
            'data_inicio' => '2025-09-01',
            'data_fim'    => '2026-06-30',
        ]);
    }
}
