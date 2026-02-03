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
     * - Nível 2: Listas, Stocks, Encomendas Editora
     * - Nível 3: Itens de Lista, Encomendas Aluno, Itens Encomenda Editora
     * - Nível 4: Itens Encomenda Aluno, Receções Editora
     * - Nível 5: Itens Receção
     * - Nível 6: Alocações Stock, Audit Logs
     */
    public function run(): void
    {
        $this->call([
            // Nível 0 - Tabelas base (sem foreign keys)
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

            // Nível 2 - Dependem de nível 1
            ListaLivroSeeder::class,
            StockSeeder::class,
            StockMovimentoSeeder::class,
            EncomendaEditoraSeeder::class,

            // Nível 3 - Dependem de nível 2
            ListaLivroItemSeeder::class,
            EncomendaAlunoSeeder::class,
            EncomendaLivroEditoraItemSeeder::class,

            // Nível 4 - Dependem de nível 3
            EncomendaLivroAlunoItemSeeder::class,
            RececaoEditoraSeeder::class,

            // Nível 5 - Dependem de nível 4
            RececaoLivroItemSeeder::class,

            // Nível 6 - Dependem de nível 5
            AlocacaoStockSeeder::class,
            AuditLogSeeder::class,
        ]);
    }
}
