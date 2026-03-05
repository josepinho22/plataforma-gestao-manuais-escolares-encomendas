<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Ordem de execução respeita as dependências de foreign keys:
     * - Nível 0: Tabelas base (sem FK)
     * - Nível 1: Escolas, Livros
     * - Nível 2: Listas (com itens criados inline)
     * - Nível 3: Encomendas Aluno
     * - Nível 4: Itens Encomenda Aluno
     */
    public function run(): void
    {
        $this->call([
            // Nível 0 - Tabelas base (sem foreign keys)
            SettingSeeder::class,
            UserSeeder::class,
            EditoraSeeder::class,
            DisciplinaSeeder::class,
            ConcelhoSeeder::class,
            AnoLetivoSeeder::class,
            AnoEscolarSeeder::class,
            AlunoSeeder::class,

            // Nível 1 - Dependem de tabelas base
            EscolaSeeder::class,
            LivroSeeder::class,

            // Nível 2 - Dependem de nível 1 (itens criados inline no ListaLivroSeeder)
            ListaLivroSeeder::class,

            // Nível 3 - Dependem de nível 2
            EncomendaAlunoSeeder::class,

            // Nível 4 - Dependem de nível 3
            EncomendaLivroAlunoItemSeeder::class,
        ]);
    }
}
