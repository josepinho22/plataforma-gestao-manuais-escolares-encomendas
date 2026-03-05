<?php

namespace Database\Seeders;

use App\Models\EncomendaLivroAlunoItem;
use App\Models\EncomendaAluno;
use App\Models\ListaLivroItem;
use App\Models\Livro;
use Illuminate\Database\Seeder;

class EncomendaLivroAlunoItemSeeder extends Seeder
{
    public function run(): void
    {
        $encomendasAluno = EncomendaAluno::all();

        foreach ($encomendasAluno as $encomenda) {
            // Se a encomenda tem lista associada, usar os livros da lista
            if ($encomenda->lista_id) {
                $itensLista = ListaLivroItem::where('lista_id', $encomenda->lista_id)->get();

                foreach ($itensLista as $item) {
                    // Adicionar manual se existir
                    if ($item->manual_livro_id) {
                        $this->criarItemEncomenda($encomenda, $item->manual_livro_id);
                    }

                    // Adicionar caderno de atividades se existir (50% chance)
                    if ($item->caderno_livro_id && rand(0, 1)) {
                        $this->criarItemEncomenda($encomenda, $item->caderno_livro_id);
                    }
                }
            } else {
                // Sem lista - adicionar alguns livros aleatórios do mesmo ano escolar
                $livros = Livro::where('ano_escolar_id', $encomenda->ano_escolar_id)
                    ->where('ativo', true)
                    ->inRandomOrder()
                    ->take(rand(2, 5))
                    ->get();

                foreach ($livros as $livro) {
                    $this->criarItemEncomenda($encomenda, $livro->id);
                }
            }

            $this->garantirMinimoDeLivros($encomenda, 2);

            // Recalcular o status com base nos itens criados e no stock existente
            $encomenda->refresh()->recalculateStatus();
        }
    }

    private function criarItemEncomenda(EncomendaAluno $encomenda, int $livroId): void
    {
        if (EncomendaLivroAlunoItem::where('encomenda_aluno_id', $encomenda->id)
            ->where('livro_id', $livroId)
            ->exists()
        ) {
            return;
        }

        $quantidade = 1;
        $encapar = (bool) rand(0, 1);

        // Determinar estados baseado no status da encomenda
        $entregue = $encomenda->status === 'ENTREGUE';
        $ensacado = in_array($encomenda->status, ['AGUARDA_LEVANTAMENTO', 'ENTREGUE']);
        $encapado = $encapar && in_array($encomenda->status, ['AGUARDA_LEVANTAMENTO', 'ENTREGUE']);
        $qtdEntregue = $entregue ? $quantidade : 0;

        EncomendaLivroAlunoItem::create([
            'encomenda_aluno_id' => $encomenda->id,
            'livro_id' => $livroId,
            'quantidade' => $quantidade,
            'encapar' => $encapar,
            'encapado' => $encapado,
            'quantidade_entregue' => $qtdEntregue,
            'entregue' => $entregue,
            'ensacado' => $ensacado,
        ]);
    }

    private function garantirMinimoDeLivros(EncomendaAluno $encomenda, int $minimo): void
    {
        $existentes = EncomendaLivroAlunoItem::where('encomenda_aluno_id', $encomenda->id)
            ->pluck('livro_id')
            ->all();

        $qtdExistente = count($existentes);
        if ($qtdExistente >= $minimo) {
            return;
        }

        $necessarios = $minimo - $qtdExistente;

        $livros = Livro::where('ano_escolar_id', $encomenda->ano_escolar_id)
            ->where('ativo', true)
            ->whereNotIn('id', $existentes)
            ->inRandomOrder()
            ->take($necessarios)
            ->get();

        foreach ($livros as $livro) {
            $this->criarItemEncomenda($encomenda, $livro->id);
        }

        $existentesAtualizados = EncomendaLivroAlunoItem::where('encomenda_aluno_id', $encomenda->id)
            ->pluck('livro_id')
            ->all();

        $qtdAtual = count($existentesAtualizados);
        if ($qtdAtual >= $minimo) {
            return;
        }

        $necessarios = $minimo - $qtdAtual;
        $livrosExtra = Livro::where('ativo', true)
            ->whereNotIn('id', $existentesAtualizados)
            ->inRandomOrder()
            ->take($necessarios)
            ->get();

        foreach ($livrosExtra as $livro) {
            $this->criarItemEncomenda($encomenda, $livro->id);
        }
    }
}
