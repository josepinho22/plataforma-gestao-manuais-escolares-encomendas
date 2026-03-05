<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use App\Models\User;
use App\Models\Aluno;
use App\Models\Livro;
use App\Models\EncomendaAluno;
use Illuminate\Database\Seeder;

class AuditLogSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        if ($users->isEmpty()) {
            return;
        }

        $logs = [];

        // Logs de criação de alunos
        $alunos = Aluno::take(3)->get();
        foreach ($alunos as $aluno) {
            $logs[] = [
                'user_id' => $users->random()->id,
                'entity_type' => 'App\\Models\\Aluno',
                'entity_id' => $aluno->id,
                'action' => 'created',
                'changes' => json_encode([
                    'nome' => $aluno->nome,
                    'nif' => $aluno->nif,
                ]),
            ];
        }

        // Logs de atualização de livros
        $livros = Livro::take(2)->get();
        foreach ($livros as $livro) {
            $logs[] = [
                'user_id' => $users->random()->id,
                'entity_type' => 'App\\Models\\Livro',
                'entity_id' => $livro->id,
                'action' => 'updated',
                'changes' => json_encode([
                    'preco' => [
                        'old' => $livro->preco - 2,
                        'new' => $livro->preco,
                    ],
                ]),
            ];
        }

        // Logs de alteração de status de encomendas
        $encomendas = EncomendaAluno::take(5)->get();
        foreach ($encomendas as $encomenda) {
            $logs[] = [
                'user_id' => $users->random()->id,
                'entity_type' => 'App\\Models\\EncomendaAluno',
                'entity_id' => $encomenda->id,
                'action' => 'status_changed',
                'changes' => json_encode([
                    'status' => [
                        'old' => 'AGUARDA_LIVROS',
                        'new' => $encomenda->status,
                    ],
                ]),
            ];
        }

        foreach ($logs as $log) {
            AuditLog::create($log);
        }
    }
}
