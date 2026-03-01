<?php

namespace Database\Seeders;

use App\Models\Livro;
use App\Models\Editora;
use App\Models\Disciplina;
use App\Models\AnoEscolar;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LivroSeeder extends Seeder
{
    public function run(): void
    {
        $editoras = Editora::all()->pluck('id', 'nome');
        $disciplinas = Disciplina::all()->pluck('id', 'nome');
        $anosEscolares = AnoEscolar::all()->pluck('id', 'name');

        $y5 = Carbon::now()->subYears(5);
        $y2 = Carbon::now()->subYears(2);
        $y1 = Carbon::now()->subYear();

        $livros = [
            // ── 5 anos atrás ─────────────────────────────────────────────
            // 1º Ano - Português
            [
                'editora_id' => $editoras['Porto Editora'],
                'disciplina_id' => $disciplinas['Português'],
                'ano_escolar_id' => $anosEscolares['1º Ano'],
                'tipo' => 'MANUAL',
                'titulo' => 'Português 1 - O Mundo da Carochinha',
                'isbn' => '978-972-0-12345-1',
                'codigo_interno' => '113421',
                'preco' => 18.50,
                'ativo' => true,
                '_updated_at' => $y5,
            ],
            [
                'editora_id' => $editoras['Porto Editora'],
                'disciplina_id' => $disciplinas['Português'],
                'ano_escolar_id' => $anosEscolares['1º Ano'],
                'tipo' => 'CADERNO_ATIVIDADES',
                'titulo' => 'Caderno de Atividades Português 1',
                'isbn' => '978-972-0-12345-2',
                'codigo_interno' => '113422',
                'preco' => 8.90,
                'ativo' => true,
                '_updated_at' => $y5,
            ],
            // 1º Ano - Matemática
            [
                'editora_id' => $editoras['Texto Editores'],
                'disciplina_id' => $disciplinas['Matemática'],
                'ano_escolar_id' => $anosEscolares['1º Ano'],
                'tipo' => 'MANUAL',
                'titulo' => 'Matemática 1 - A Grande Aventura',
                'isbn' => '978-972-0-22345-1',
                'codigo_interno' => '224531',
                'preco' => 19.20,
                'ativo' => true,
                '_updated_at' => $y5,
            ],
            [
                'editora_id' => $editoras['Texto Editores'],
                'disciplina_id' => $disciplinas['Matemática'],
                'ano_escolar_id' => $anosEscolares['1º Ano'],
                'tipo' => 'CADERNO_ATIVIDADES',
                'titulo' => 'Caderno de Atividades Matemática 1',
                'isbn' => '978-972-0-22345-2',
                'codigo_interno' => null,
                'preco' => 7.50,
                'ativo' => true,
                '_updated_at' => $y5,
            ],
            // 1º Ano - Estudo do Meio
            [
                'editora_id' => $editoras['Leya Educação'],
                'disciplina_id' => $disciplinas['Estudo do Meio'],
                'ano_escolar_id' => $anosEscolares['1º Ano'],
                'tipo' => 'MANUAL',
                'titulo' => 'Estudo do Meio 1 - Alfa',
                'isbn' => '978-972-0-32345-1',
                'codigo_interno' => '335610',
                'preco' => 16.80,
                'ativo' => true,
                '_updated_at' => $y5,
            ],
            // 2º Ano
            ['editora_id' => $editoras['Porto Editora'], 'disciplina_id' => $disciplinas['Português'], 'ano_escolar_id' => $anosEscolares['2º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'Português 2 - Pasta Mágica', 'isbn' => '978-972-0-21001-1', 'codigo_interno' => '210011', 'preco' => 18.90, 'ativo' => true, '_updated_at' => $y5],
            ['editora_id' => $editoras['Texto Editores'], 'disciplina_id' => $disciplinas['Matemática'], 'ano_escolar_id' => $anosEscolares['2º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'Matemática 2 - A Grande Aventura', 'isbn' => '978-972-0-21002-1', 'codigo_interno' => null, 'preco' => 19.50, 'ativo' => true, '_updated_at' => $y5],
            ['editora_id' => $editoras['Leya Educação'], 'disciplina_id' => $disciplinas['Estudo do Meio'], 'ano_escolar_id' => $anosEscolares['2º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'Estudo do Meio 2 - Alfa', 'isbn' => '978-972-0-21003-1', 'codigo_interno' => null, 'preco' => 17.20, 'ativo' => true, '_updated_at' => $y5],

            // ── 2 anos atrás ─────────────────────────────────────────────
            // 5º Ano - Português
            [
                'editora_id' => $editoras['Porto Editora'],
                'disciplina_id' => $disciplinas['Português'],
                'ano_escolar_id' => $anosEscolares['5º Ano'],
                'tipo' => 'MANUAL',
                'titulo' => 'Português 5 - Diálogos',
                'isbn' => '978-972-0-52345-1',
                'codigo_interno' => '512340',
                'preco' => 22.50,
                'ativo' => true,
                '_updated_at' => $y2,
            ],
            [
                'editora_id' => $editoras['Porto Editora'],
                'disciplina_id' => $disciplinas['Português'],
                'ano_escolar_id' => $anosEscolares['5º Ano'],
                'tipo' => 'CADERNO_ATIVIDADES',
                'titulo' => 'Caderno de Atividades Português 5',
                'isbn' => '978-972-0-52345-2',
                'codigo_interno' => null,
                'preco' => 9.90,
                'ativo' => true,
                '_updated_at' => $y2,
            ],
            // 5º Ano - Matemática
            ['editora_id' => $editoras['Raiz Editora'], 'disciplina_id' => $disciplinas['Matemática'], 'ano_escolar_id' => $anosEscolares['5º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'Matemática 5 - Pi', 'isbn' => '978-972-0-62345-1', 'codigo_interno' => '624781', 'preco' => 24.90, 'ativo' => true, '_updated_at' => $y2],
            // 5º Ano - Inglês
            ['editora_id' => $editoras['Areal Editores'], 'disciplina_id' => $disciplinas['Inglês'], 'ano_escolar_id' => $anosEscolares['5º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'English Plus 5', 'isbn' => '978-972-0-72345-1', 'codigo_interno' => '735219', 'preco' => 21.50, 'ativo' => true, '_updated_at' => $y2],
            ['editora_id' => $editoras['Areal Editores'], 'disciplina_id' => $disciplinas['Inglês'], 'ano_escolar_id' => $anosEscolares['5º Ano'], 'tipo' => 'CADERNO_ATIVIDADES', 'titulo' => 'English Plus 5 - Workbook', 'isbn' => '978-972-0-72345-2', 'codigo_interno' => null, 'preco' => 10.50, 'ativo' => true, '_updated_at' => $y2],
            // 5º Ano - Ciências Naturais
            ['editora_id' => $editoras['Santillana'], 'disciplina_id' => $disciplinas['Ciências Naturais'], 'ano_escolar_id' => $anosEscolares['5º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'Ciências Naturais 5 - Descobrir a Terra', 'isbn' => '978-972-0-82345-1', 'codigo_interno' => '846320', 'preco' => 20.80, 'ativo' => true, '_updated_at' => $y2],
            // 5º Ano - História
            ['editora_id' => $editoras['ASA'], 'disciplina_id' => $disciplinas['História'], 'ano_escolar_id' => $anosEscolares['5º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'História e Geografia de Portugal 5', 'isbn' => '978-972-0-92345-1', 'codigo_interno' => null, 'preco' => 19.90, 'ativo' => true, '_updated_at' => $y2],
            // 3º Ano
            ['editora_id' => $editoras['Porto Editora'], 'disciplina_id' => $disciplinas['Português'], 'ano_escolar_id' => $anosEscolares['3º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'Português 3 - Pasta Mágica', 'isbn' => '978-972-0-31001-1', 'codigo_interno' => '310011', 'preco' => 19.20, 'ativo' => true, '_updated_at' => $y2],
            ['editora_id' => $editoras['Raiz Editora'], 'disciplina_id' => $disciplinas['Matemática'], 'ano_escolar_id' => $anosEscolares['3º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'Matemática 3 - Clube', 'isbn' => '978-972-0-31002-1', 'codigo_interno' => null, 'preco' => 20.10, 'ativo' => true, '_updated_at' => $y2],
            ['editora_id' => $editoras['Areal Editores'], 'disciplina_id' => $disciplinas['Inglês'], 'ano_escolar_id' => $anosEscolares['3º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'Hello! 3', 'isbn' => '978-972-0-31003-1', 'codigo_interno' => '310031', 'preco' => 16.80, 'ativo' => true, '_updated_at' => $y2],
            // 4º Ano
            ['editora_id' => $editoras['Porto Editora'], 'disciplina_id' => $disciplinas['Português'], 'ano_escolar_id' => $anosEscolares['4º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'Português 4 - Pasta Mágica', 'isbn' => '978-972-0-41001-1', 'codigo_interno' => '410011', 'preco' => 19.50, 'ativo' => true, '_updated_at' => $y2],
            ['editora_id' => $editoras['Texto Editores'], 'disciplina_id' => $disciplinas['Matemática'], 'ano_escolar_id' => $anosEscolares['4º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'Matemática 4 - A Grande Aventura', 'isbn' => '978-972-0-41002-1', 'codigo_interno' => null, 'preco' => 20.50, 'ativo' => true, '_updated_at' => $y2],
            ['editora_id' => $editoras['ASA'], 'disciplina_id' => $disciplinas['Estudo do Meio'], 'ano_escolar_id' => $anosEscolares['4º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'Estudo do Meio 4 - Crescer', 'isbn' => '978-972-0-41003-1', 'codigo_interno' => '410031', 'preco' => 17.90, 'ativo' => true, '_updated_at' => $y2],

            // ── 1 ano atrás ──────────────────────────────────────────────
            // 9º Ano
            ['editora_id' => $editoras['Porto Editora'], 'disciplina_id' => $disciplinas['Português'], 'ano_escolar_id' => $anosEscolares['9º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'Português 9 - Expressões', 'isbn' => '978-972-0-93345-1', 'codigo_interno' => '912480', 'preco' => 25.90, 'ativo' => true, '_updated_at' => $y1],
            ['editora_id' => $editoras['Texto Editores'], 'disciplina_id' => $disciplinas['Matemática'], 'ano_escolar_id' => $anosEscolares['9º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'Matemática 9 - Xis', 'isbn' => '978-972-0-93345-2', 'codigo_interno' => null, 'preco' => 27.50, 'ativo' => true, '_updated_at' => $y1],
            ['editora_id' => $editoras['Leya Educação'], 'disciplina_id' => $disciplinas['Físico-Química'], 'ano_escolar_id' => $anosEscolares['9º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'FQ 9 - Universo da Matéria', 'isbn' => '978-972-0-93345-3', 'codigo_interno' => '937650', 'preco' => 23.80, 'ativo' => true, '_updated_at' => $y1],
            // 6º Ano
            ['editora_id' => $editoras['Porto Editora'], 'disciplina_id' => $disciplinas['Português'], 'ano_escolar_id' => $anosEscolares['6º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'Português 6 - Diálogos', 'isbn' => '978-972-0-61001-1', 'codigo_interno' => '610011', 'preco' => 22.90, 'ativo' => true, '_updated_at' => $y1],
            ['editora_id' => $editoras['Texto Editores'], 'disciplina_id' => $disciplinas['Matemática'], 'ano_escolar_id' => $anosEscolares['6º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'Matemática 6 - Novo', 'isbn' => '978-972-0-61002-1', 'codigo_interno' => null, 'preco' => 24.50, 'ativo' => true, '_updated_at' => $y1],
            ['editora_id' => $editoras['Areal Editores'], 'disciplina_id' => $disciplinas['Inglês'], 'ano_escolar_id' => $anosEscolares['6º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'English Plus 6', 'isbn' => '978-972-0-61003-1', 'codigo_interno' => '610031', 'preco' => 21.90, 'ativo' => true, '_updated_at' => $y1],
            ['editora_id' => $editoras['ASA'], 'disciplina_id' => $disciplinas['História'], 'ano_escolar_id' => $anosEscolares['6º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'História e Geografia de Portugal 6', 'isbn' => '978-972-0-61004-1', 'codigo_interno' => null, 'preco' => 20.50, 'ativo' => true, '_updated_at' => $y1],
            // 7º Ano
            ['editora_id' => $editoras['Porto Editora'], 'disciplina_id' => $disciplinas['Português'], 'ano_escolar_id' => $anosEscolares['7º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'Português 7 - Plural', 'isbn' => '978-972-0-71001-1', 'codigo_interno' => '710011', 'preco' => 23.50, 'ativo' => true, '_updated_at' => $y1],
            ['editora_id' => $editoras['Raiz Editora'], 'disciplina_id' => $disciplinas['Matemática'], 'ano_escolar_id' => $anosEscolares['7º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'Matemática 7 - Pi', 'isbn' => '978-972-0-71002-1', 'codigo_interno' => null, 'preco' => 25.00, 'ativo' => true, '_updated_at' => $y1],
            ['editora_id' => $editoras['Santillana'], 'disciplina_id' => $disciplinas['Ciências Naturais'], 'ano_escolar_id' => $anosEscolares['7º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'Ciências Naturais 7 - Terra Viva', 'isbn' => '978-972-0-71003-1', 'codigo_interno' => '710031', 'preco' => 21.80, 'ativo' => true, '_updated_at' => $y1],
            // 8º Ano
            ['editora_id' => $editoras['Porto Editora'], 'disciplina_id' => $disciplinas['Português'], 'ano_escolar_id' => $anosEscolares['8º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'Português 8 - Plural', 'isbn' => '978-972-0-81001-1', 'codigo_interno' => '810011', 'preco' => 24.20, 'ativo' => true, '_updated_at' => $y1],
            ['editora_id' => $editoras['Leya Educação'], 'disciplina_id' => $disciplinas['Físico-Química'], 'ano_escolar_id' => $anosEscolares['8º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'FQ 8 - Universo da Matéria', 'isbn' => '978-972-0-81002-1', 'codigo_interno' => null, 'preco' => 23.50, 'ativo' => true, '_updated_at' => $y1],
            ['editora_id' => $editoras['Texto Editores'], 'disciplina_id' => $disciplinas['Matemática'], 'ano_escolar_id' => $anosEscolares['8º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'Matemática 8 - Xis', 'isbn' => '978-972-0-81003-1', 'codigo_interno' => '810031', 'preco' => 26.00, 'ativo' => true, '_updated_at' => $y1],
            // 10º Ano
            ['editora_id' => $editoras['Porto Editora'], 'disciplina_id' => $disciplinas['Filosofia'], 'ano_escolar_id' => $anosEscolares['10º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'Filosofia 10 - Pensar Azul', 'isbn' => '978-972-0-10345-1', 'codigo_interno' => null, 'preco' => 24.50, 'ativo' => true, '_updated_at' => $y1],
            ['editora_id' => $editoras['Areal Editores'], 'disciplina_id' => $disciplinas['Biologia'], 'ano_escolar_id' => $anosEscolares['10º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'Biologia e Geologia 10', 'isbn' => '978-972-0-10345-2', 'codigo_interno' => '1045231', 'preco' => 28.90, 'ativo' => true, '_updated_at' => $y1],
            // 11º Ano
            ['editora_id' => $editoras['Porto Editora'], 'disciplina_id' => $disciplinas['Português'], 'ano_escolar_id' => $anosEscolares['11º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'Português 11 - Expressões', 'isbn' => '978-972-0-11001-1', 'codigo_interno' => '110011', 'preco' => 26.90, 'ativo' => true, '_updated_at' => $y1],
            ['editora_id' => $editoras['Texto Editores'], 'disciplina_id' => $disciplinas['Matemática'], 'ano_escolar_id' => $anosEscolares['11º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'Matemática A 11', 'isbn' => '978-972-0-11002-1', 'codigo_interno' => null, 'preco' => 29.50, 'ativo' => true, '_updated_at' => $y1],
            // 12º Ano
            ['editora_id' => $editoras['Porto Editora'], 'disciplina_id' => $disciplinas['Português'], 'ano_escolar_id' => $anosEscolares['12º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'Português 12 - Expressões', 'isbn' => '978-972-0-12001-1', 'codigo_interno' => '120011', 'preco' => 27.50, 'ativo' => true, '_updated_at' => $y1],
            ['editora_id' => $editoras['Leya Educação'], 'disciplina_id' => $disciplinas['Físico-Química'], 'ano_escolar_id' => $anosEscolares['12º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'FQ 12 - Universo da Matéria', 'isbn' => '978-972-0-12002-1', 'codigo_interno' => null, 'preco' => 30.00, 'ativo' => true, '_updated_at' => $y1],
            ['editora_id' => $editoras['Santillana'], 'disciplina_id' => $disciplinas['Economia'], 'ano_escolar_id' => $anosEscolares['12º Ano'], 'tipo' => 'MANUAL', 'titulo' => 'Economia 12', 'isbn' => '978-972-0-12003-1', 'codigo_interno' => '120031', 'preco' => 28.50, 'ativo' => true, '_updated_at' => $y1],

            // Livro inativo para teste
            [
                'editora_id' => $editoras['Porto Editora'],
                'disciplina_id' => $disciplinas['Português'],
                'ano_escolar_id' => $anosEscolares['1º Ano'],
                'tipo' => 'MANUAL',
                'titulo' => 'Manual Antigo Português 1 (Descontinuado)',
                'isbn' => '978-972-0-00000-0',
                'codigo_interno' => null,
                'preco' => 15.00,
                'ativo' => false,
                '_updated_at' => $y5,
            ],
        ];

        foreach ($livros as $dados) {
            $updatedAt = $dados['_updated_at'];
            unset($dados['_updated_at']);

            $livro = Livro::create($dados);

            DB::table('livros')->where('id', $livro->id)->update([
                'created_at' => $updatedAt,
                'updated_at' => $updatedAt,
            ]);
        }
    }
}
