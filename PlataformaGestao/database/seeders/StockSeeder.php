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
            // Quantidade entre 0 e 50
            Stock::create([
                'livro_id' => $livro->id,
                'quantidade' => rand(0, 50),
            ]);
        }
    }
}
