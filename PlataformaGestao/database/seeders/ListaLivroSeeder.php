<?php

namespace Database\Seeders;

use App\Models\ListaLivro;
use App\Models\ListaLivroItem;
use App\Models\Escola;
use App\Models\AnoLetivo;
use App\Models\AnoEscolar;
use App\Models\Livro;
use App\Models\Editora;
use Illuminate\Database\Seeder;

class ListaLivroSeeder extends Seeder
{
    /**
     * Editora fixa por escola — todos os livros de uma lista são da mesma editora.
     */
    private const EDITORA_POR_ESCOLA = [
        'Escola Básica João de Deus'             => 'Porto Editora',
        'Escola Básica de Gaia'                  => 'Texto Editores',
        'Escola Básica de Matosinhos'            => 'Leya Educação',
        'Escola Básica da Maia'                  => 'Areal Editores',
        'Escola Básica de Gondomar'              => 'Santillana',
        'Escola Secundária Rodrigues de Freitas' => 'Porto Editora',
        'Escola Secundária de Gaia'              => 'Texto Editores',
        'Escola Secundária de Matosinhos'        => 'Leya Educação',
        'Escola Secundária da Maia'              => 'Areal Editores',
        'Escola Secundária de Gondomar'          => 'Santillana',
    ];

    private const ANOS_BASICO    = ['1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano', '6º Ano'];
    private const ANOS_SECUNDARIO = ['7º Ano', '8º Ano', '9º Ano', '10º Ano', '11º Ano', '12º Ano'];

    private const ESCOLAS_BASICAS = [
        'Escola Básica João de Deus',
        'Escola Básica de Gaia',
        'Escola Básica de Matosinhos',
        'Escola Básica da Maia',
        'Escola Básica de Gondomar',
    ];

    private const ESCOLAS_SECUNDARIAS = [
        'Escola Secundária Rodrigues de Freitas',
        'Escola Secundária de Gaia',
        'Escola Secundária de Matosinhos',
        'Escola Secundária da Maia',
        'Escola Secundária de Gondomar',
    ];

    public function run(): void
    {
        $anoLetivo = AnoLetivo::where('nome', '2025/2026')->first();
        if (! $anoLetivo) {
            return;
        }

        $escolas  = Escola::where('isAtivo', true)->get()->keyBy('nome');
        $editoras = Editora::all()->keyBy('nome');

        $grupos = [
            ['escolas' => self::ESCOLAS_BASICAS,     'anos' => self::ANOS_BASICO],
            ['escolas' => self::ESCOLAS_SECUNDARIAS, 'anos' => self::ANOS_SECUNDARIO],
        ];

        foreach ($grupos as ['escolas' => $escolasGrupo, 'anos' => $anosGrupo]) {
            foreach ($escolasGrupo as $escolaNome) {
                $escola = $escolas[$escolaNome] ?? null;
                if (! $escola) {
                    continue;
                }

                $editoraNome = self::EDITORA_POR_ESCOLA[$escolaNome] ?? null;
                $editora     = $editoraNome ? ($editoras[$editoraNome] ?? null) : null;
                if (! $editora) {
                    continue;
                }

                foreach ($anosGrupo as $anoNome) {
                    $anoEscolar = AnoEscolar::where('name', $anoNome)->first();
                    if (! $anoEscolar) {
                        continue;
                    }

                    $lista = ListaLivro::create([
                        'escola_id'      => $escola->id,
                        'ano_letivo_id'  => $anoLetivo->id,
                        'ano_escolar_id' => $anoEscolar->id,
                    ]);

                    $this->criarItens($lista, $anoEscolar->id, $editora->id);
                }
            }
        }
    }

    /**
     * Cria os itens da lista usando apenas livros da editora atribuída à escola.
     * Para cada disciplina: associa o manual e, se existir, o caderno de atividades ligado.
     */
    private function criarItens(ListaLivro $lista, int $anoEscolarId, int $editoraId): void
    {
        $manuais = Livro::where('ano_escolar_id', $anoEscolarId)
            ->where('editora_id', $editoraId)
            ->where('tipo', 'MANUAL')
            ->where('ativo', true)
            ->get();

        if ($manuais->isEmpty()) {
            return;
        }

        // Indexar cadernos pelo manual a que pertencem (livro_relacionado_id)
        $cadernosIds = $manuais->pluck('id');
        $cadernos    = Livro::where('ano_escolar_id', $anoEscolarId)
            ->where('editora_id', $editoraId)
            ->where('tipo', 'CADERNO_ATIVIDADES')
            ->whereIn('livro_relacionado_id', $cadernosIds)
            ->get()
            ->keyBy('livro_relacionado_id');

        foreach ($manuais as $manual) {
            $caderno = $cadernos[$manual->id] ?? null;

            ListaLivroItem::create([
                'lista_id'         => $lista->id,
                'disciplina_id'    => $manual->disciplina_id,
                'manual_livro_id'  => $manual->id,
                'caderno_livro_id' => $caderno?->id,
            ]);
        }
    }
}
