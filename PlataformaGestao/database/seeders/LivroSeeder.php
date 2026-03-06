<?php

namespace Database\Seeders;

use App\Models\Livro;
use App\Models\Editora;
use App\Models\Disciplina;
use App\Models\AnoEscolar;
use Illuminate\Database\Seeder;

class LivroSeeder extends Seeder
{
    /**
     * Disciplinas que têm caderno de atividades vinculado ao manual.
     * A ligação é bidirecional: manual.livro_relacionado_id = caderno.id
     *                           caderno.livro_relacionado_id = manual.id
     */
    private const COM_CADERNO = ['Português', 'Matemática', 'Inglês', 'Estudo do Meio'];

    private const DISCIPLINAS_POR_ANO = [
        '1º Ano'  => ['Português', 'Matemática', 'Estudo do Meio'],
        '2º Ano'  => ['Português', 'Matemática', 'Estudo do Meio'],
        '3º Ano'  => ['Português', 'Matemática', 'Estudo do Meio', 'Inglês'],
        '4º Ano'  => ['Português', 'Matemática', 'Estudo do Meio', 'Inglês'],
        '5º Ano'  => ['Português', 'Matemática', 'Inglês', 'Ciências Naturais', 'História', 'Educação Visual'],
        '6º Ano'  => ['Português', 'Matemática', 'Inglês', 'Ciências Naturais', 'História', 'Educação Visual'],
        '7º Ano'  => ['Português', 'Matemática', 'Inglês', 'Ciências Naturais', 'Físico-Química', 'História', 'Geografia'],
        '8º Ano'  => ['Português', 'Matemática', 'Inglês', 'Ciências Naturais', 'Físico-Química', 'História', 'Geografia'],
        '9º Ano'  => ['Português', 'Matemática', 'Inglês', 'Ciências Naturais', 'Físico-Química', 'História', 'Geografia'],
        '10º Ano' => ['Português', 'Matemática', 'Inglês', 'Filosofia', 'Biologia', 'Físico-Química'],
        '11º Ano' => ['Português', 'Matemática', 'Inglês', 'Filosofia', 'Biologia', 'Físico-Química'],
        '12º Ano' => ['Português', 'Matemática', 'Inglês', 'Biologia', 'Físico-Química', 'Economia'],
    ];

    private const PRECOS = [
        '1º Ano'  => [18.50,  8.50],
        '2º Ano'  => [19.00,  8.50],
        '3º Ano'  => [19.50,  9.00],
        '4º Ano'  => [20.00,  9.00],
        '5º Ano'  => [22.00, 10.00],
        '6º Ano'  => [22.50, 10.00],
        '7º Ano'  => [24.00, 11.00],
        '8º Ano'  => [24.50, 11.00],
        '9º Ano'  => [25.00, 11.50],
        '10º Ano' => [27.00, 12.50],
        '11º Ano' => [27.50, 12.50],
        '12º Ano' => [28.00, 13.00],
    ];

    private const ABREV_EDITORA = [
        'Porto Editora'  => 'PE',
        'Texto Editores' => 'TE',
        'Leya Educação'  => 'LE',
        'Areal Editores' => 'AE',
        'Santillana'     => 'SAN',
    ];

    private const COD_EDITORA = [
        'Porto Editora'  => '1',
        'Texto Editores' => '2',
        'Leya Educação'  => '3',
        'Areal Editores' => '4',
        'Santillana'     => '5',
    ];

    private const COD_ANO = [
        '1º Ano'  => '01', '2º Ano'  => '02', '3º Ano'  => '03', '4º Ano'  => '04',
        '5º Ano'  => '05', '6º Ano'  => '06', '7º Ano'  => '07', '8º Ano'  => '08',
        '9º Ano'  => '09', '10º Ano' => '10', '11º Ano' => '11', '12º Ano' => '12',
    ];

    private const COD_DISCIPLINA = [
        'Português'         => '01',
        'Matemática'        => '02',
        'Estudo do Meio'    => '03',
        'Inglês'            => '04',
        'Ciências Naturais' => '05',
        'Físico-Química'    => '06',
        'História'          => '07',
        'Geografia'         => '08',
        'Educação Visual'   => '09',
        'Filosofia'         => '10',
        'Biologia'          => '11',
        'Economia'          => '12',
    ];

    public function run(): void
    {
        $editoras    = Editora::all()->keyBy('nome');
        $disciplinas = Disciplina::all()->keyBy('nome');
        $anos        = AnoEscolar::all()->keyBy('name');

        foreach (self::DISCIPLINAS_POR_ANO as $anoNome => $disciplinasAno) {
            $ano = $anos[$anoNome] ?? null;
            if (! $ano) {
                continue;
            }

            $codA              = self::COD_ANO[$anoNome];
            [$precoM, $precoC] = self::PRECOS[$anoNome];

            foreach ($editoras as $editoraNome => $editora) {
                $abrevE = self::ABREV_EDITORA[$editoraNome] ?? $editoraNome;
                $codE   = self::COD_EDITORA[$editoraNome]   ?? '9';

                foreach ($disciplinasAno as $disciplinaNome) {
                    $disciplina = $disciplinas[$disciplinaNome] ?? null;
                    if (! $disciplina) {
                        continue;
                    }

                    $codD = self::COD_DISCIPLINA[$disciplinaNome] ?? '99';

                    $manual = Livro::create([
                        'editora_id'     => $editora->id,
                        'disciplina_id'  => $disciplina->id,
                        'ano_escolar_id' => $ano->id,
                        'tipo'           => 'MANUAL',
                        'titulo'         => "{$disciplinaNome} {$anoNome} - {$abrevE}",
                        'isbn'           => "978-{$codE}-{$codA}-{$codD}-M",
                        'codigo_interno' => "{$abrevE}{$codA}D{$codD}M",
                        'preco'          => $precoM,
                        'ativo'          => true,
                    ]);

                    if (in_array($disciplinaNome, self::COM_CADERNO)) {
                        $caderno = Livro::create([
                            'editora_id'          => $editora->id,
                            'disciplina_id'       => $disciplina->id,
                            'ano_escolar_id'      => $ano->id,
                            'livro_relacionado_id' => $manual->id,
                            'tipo'                => 'CADERNO_ATIVIDADES',
                            'titulo'              => "Caderno {$disciplinaNome} {$anoNome} - {$abrevE}",
                            'isbn'                => "978-{$codE}-{$codA}-{$codD}-C",
                            'codigo_interno'      => "{$abrevE}{$codA}D{$codD}C",
                            'preco'               => $precoC,
                            'ativo'               => true,
                        ]);

                        // Vínculo bidirecional: manual aponta também para o caderno
                        $manual->update(['livro_relacionado_id' => $caderno->id]);
                    }
                }
            }
        }
    }
}
