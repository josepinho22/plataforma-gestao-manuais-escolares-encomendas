<?php

namespace Database\Seeders;

use App\Models\Stock;
use App\Models\Livro;
use Illuminate\Database\Seeder;

class StockSeeder extends Seeder
{
    public function run(): void
    {
        // Criar stock para cada livro ativo
        $livros = Livro::where('ativo', true)->get();

        foreach ($livros as $livro) {
            Stock::create([
                'livro_id' => $livro->id,
                'quantidade' => rand(5, 50),
            ]);
        }
    }
}
