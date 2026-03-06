<?php

namespace Database\Seeders;

use App\Models\Aluno;
use Illuminate\Database\Seeder;

class AlunoSeeder extends Seeder
{
    public function run(): void
    {
        Aluno::create([
            'nif'            => '123456789',
            'id_mega'        => 'MEGA001',
            'nome'           => 'Pedro Miguel Rodrigues',
            'telefone'       => '912345678',
            'email'          => 'pedro.rodrigues@email.pt',
            'numero_cliente' => 'CLI001',
        ]);
    }
}
