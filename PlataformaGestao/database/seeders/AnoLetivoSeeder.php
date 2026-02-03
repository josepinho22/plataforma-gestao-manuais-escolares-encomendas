<?php

namespace Database\Seeders;

use App\Models\AnoLetivo;
use Illuminate\Database\Seeder;

class AnoLetivoSeeder extends Seeder
{
    public function run(): void
    {
        $anosLetivos = [
            [
                'nome' => '2023/2024',
                'data_inicio' => '2023-09-01',
                'data_fim' => '2024-06-30',
            ],
            [
                'nome' => '2024/2025',
                'data_inicio' => '2024-09-01',
                'data_fim' => '2025-06-30',
            ],
            [
                'nome' => '2025/2026',
                'data_inicio' => '2025-09-01',
                'data_fim' => '2026-06-30',
            ],
        ];

        foreach ($anosLetivos as $anoLetivo) {
            AnoLetivo::create($anoLetivo);
        }
    }
}
