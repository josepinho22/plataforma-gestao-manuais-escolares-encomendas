<?php

namespace Database\Seeders;

use App\Models\Aluno;
use Illuminate\Database\Seeder;

class AlunoSeeder extends Seeder
{
    public function run(): void
    {
        $alunos = [
            [
                'nif'            => '123456789',
                'id_mega'        => 'MEGA001',
                'nome'           => 'Pedro Miguel Rodrigues',
                'telefone'       => '912345678',
                'email'          => 'pedro.rodrigues@email.pt',
                'numero_cliente' => 'CLI001',
            ],
            [
                'nif'            => '234567890',
                'id_mega'        => 'MEGA002',
                'nome'           => 'Maria João Costa',
                'telefone'       => '923456789',
                'email'          => 'maria.costa@email.pt',
                'numero_cliente' => 'CLI002',
            ],
            [
                'nif'            => '345678901',
                'id_mega'        => 'MEGA003',
                'nome'           => 'Tiago Alexandre Ferreira',
                'telefone'       => '934567890',
                'email'          => 'tiago.ferreira@email.pt',
                'numero_cliente' => 'CLI003',
            ],
            [
                'nif'            => '456789012',
                'id_mega'        => 'MEGA004',
                'nome'           => 'Mariana Isabel Almeida',
                'telefone'       => '945678901',
                'email'          => 'mariana.almeida@email.pt',
                'numero_cliente' => 'CLI004',
            ],
            [
                'nif'            => '567890123',
                'id_mega'        => 'MEGA005',
                'nome'           => 'Diogo Rafael Martins',
                'telefone'       => '956789012',
                'email'          => 'diogo.martins@email.pt',
                'numero_cliente' => 'CLI005',
            ],
        ];

        foreach ($alunos as $aluno) {
            Aluno::create($aluno);
        }
    }
}
