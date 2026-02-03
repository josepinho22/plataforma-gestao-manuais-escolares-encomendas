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
                'nif' => '123456789',
                'id_mega' => 'MEGA001',
                'nome' => 'Pedro Miguel Rodrigues',
                'telefone' => '912345678',
                'email' => 'pedro.rodrigues@email.pt',
                'numero_cliente' => 'CLI001',
            ],
            [
                'nif' => '234567890',
                'id_mega' => 'MEGA002',
                'nome' => 'Ana Beatriz Costa',
                'telefone' => '923456789',
                'email' => 'ana.costa@email.pt',
                'numero_cliente' => 'CLI002',
            ],
            [
                'nif' => '345678901',
                'id_mega' => 'MEGA003',
                'nome' => 'Tiago Alexandre Pereira',
                'telefone' => '934567890',
                'email' => 'tiago.pereira@email.pt',
                'numero_cliente' => 'CLI003',
            ],
            [
                'nif' => '456789012',
                'id_mega' => 'MEGA004',
                'nome' => 'Mariana Isabel Fernandes',
                'telefone' => '945678901',
                'email' => 'mariana.fernandes@email.pt',
                'numero_cliente' => 'CLI004',
            ],
            [
                'nif' => '567890123',
                'id_mega' => 'MEGA005',
                'nome' => 'Diogo Rafael Martins',
                'telefone' => '956789012',
                'email' => 'diogo.martins@email.pt',
                'numero_cliente' => 'CLI005',
            ],
            [
                'nif' => '678901234',
                'id_mega' => 'MEGA006',
                'nome' => 'Sofia Catarina Almeida',
                'telefone' => '967890123',
                'email' => 'sofia.almeida@email.pt',
                'numero_cliente' => 'CLI006',
            ],
            [
                'nif' => '789012345',
                'id_mega' => 'MEGA007',
                'nome' => 'Gonçalo José Oliveira',
                'telefone' => '978901234',
                'email' => 'goncalo.oliveira@email.pt',
                'numero_cliente' => 'CLI007',
            ],
            [
                'nif' => '890123456',
                'id_mega' => 'MEGA008',
                'nome' => 'Inês Maria Santos',
                'telefone' => '989012345',
                'email' => 'ines.santos@email.pt',
                'numero_cliente' => 'CLI008',
            ],
            [
                'nif' => '901234567',
                'id_mega' => 'MEGA009',
                'nome' => 'Ricardo André Sousa',
                'telefone' => '990123456',
                'email' => 'ricardo.sousa@email.pt',
                'numero_cliente' => 'CLI009',
            ],
            [
                'nif' => '012345678',
                'id_mega' => 'MEGA010',
                'nome' => 'Carolina Sofia Ribeiro',
                'telefone' => '911234567',
                'email' => 'carolina.ribeiro@email.pt',
                'numero_cliente' => 'CLI010',
            ],
        ];

        foreach ($alunos as $aluno) {
            Aluno::create($aluno);
        }
    }
}
