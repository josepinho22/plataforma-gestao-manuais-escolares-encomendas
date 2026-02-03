<?php

namespace Database\Seeders;

use App\Models\Disciplina;
use Illuminate\Database\Seeder;

class DisciplinaSeeder extends Seeder
{
    public function run(): void
    {
        $disciplinas = [
            'Português',
            'Matemática',
            'Estudo do Meio',
            'Inglês',
            'Ciências Naturais',
            'Físico-Química',
            'História',
            'Geografia',
            'Educação Visual',
            'Educação Tecnológica',
            'Educação Musical',
            'Educação Física',
            'Filosofia',
            'Biologia',
            'Geologia',
            'Economia',
            'Francês',
            'Espanhol',
            'Alemão',
            'EMRC',
        ];

        foreach ($disciplinas as $nome) {
            Disciplina::create(['nome' => $nome]);
        }
    }
}
