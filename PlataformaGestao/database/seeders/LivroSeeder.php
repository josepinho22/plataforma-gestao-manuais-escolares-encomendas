<?php

namespace Database\Seeders;

use App\Models\Livro;
use App\Models\Editora;
use App\Models\Disciplina;
use App\Models\AnoEscolar;
use Illuminate\Database\Seeder;

class LivroSeeder extends Seeder
{
    public function run(): void
    {
        $editoras = Editora::all()->pluck('id', 'nome');
        $disciplinas = Disciplina::all()->pluck('id', 'nome');
        $anosEscolares = AnoEscolar::all()->pluck('id', 'name');

        $livros = [
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
            ],

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
            ],
            // 5º Ano - Matemática
            [
                'editora_id' => $editoras['Raiz Editora'],
                'disciplina_id' => $disciplinas['Matemática'],
                'ano_escolar_id' => $anosEscolares['5º Ano'],
                'tipo' => 'MANUAL',
                'titulo' => 'Matemática 5 - Pi',
                'isbn' => '978-972-0-62345-1',
                'codigo_interno' => '624781',
                'preco' => 24.90,
                'ativo' => true,
            ],
            // 5º Ano - Inglês
            [
                'editora_id' => $editoras['Areal Editores'],
                'disciplina_id' => $disciplinas['Inglês'],
                'ano_escolar_id' => $anosEscolares['5º Ano'],
                'tipo' => 'MANUAL',
                'titulo' => 'English Plus 5',
                'isbn' => '978-972-0-72345-1',
                'codigo_interno' => '735219',
                'preco' => 21.50,
                'ativo' => true,
            ],
            [
                'editora_id' => $editoras['Areal Editores'],
                'disciplina_id' => $disciplinas['Inglês'],
                'ano_escolar_id' => $anosEscolares['5º Ano'],
                'tipo' => 'CADERNO_ATIVIDADES',
                'titulo' => 'English Plus 5 - Workbook',
                'isbn' => '978-972-0-72345-2',
                'codigo_interno' => null,
                'preco' => 10.50,
                'ativo' => true,
            ],
            // 5º Ano - Ciências Naturais
            [
                'editora_id' => $editoras['Santillana'],
                'disciplina_id' => $disciplinas['Ciências Naturais'],
                'ano_escolar_id' => $anosEscolares['5º Ano'],
                'tipo' => 'MANUAL',
                'titulo' => 'Ciências Naturais 5 - Descobrir a Terra',
                'isbn' => '978-972-0-82345-1',
                'codigo_interno' => '846320',
                'preco' => 20.80,
                'ativo' => true,
            ],
            // 5º Ano - História
            [
                'editora_id' => $editoras['ASA'],
                'disciplina_id' => $disciplinas['História'],
                'ano_escolar_id' => $anosEscolares['5º Ano'],
                'tipo' => 'MANUAL',
                'titulo' => 'História e Geografia de Portugal 5',
                'isbn' => '978-972-0-92345-1',
                'codigo_interno' => null,
                'preco' => 19.90,
                'ativo' => true,
            ],

            // 9º Ano - Português
            [
                'editora_id' => $editoras['Porto Editora'],
                'disciplina_id' => $disciplinas['Português'],
                'ano_escolar_id' => $anosEscolares['9º Ano'],
                'tipo' => 'MANUAL',
                'titulo' => 'Português 9 - Expressões',
                'isbn' => '978-972-0-93345-1',
                'codigo_interno' => '912480',
                'preco' => 25.90,
                'ativo' => true,
            ],
            // 9º Ano - Matemática
            [
                'editora_id' => $editoras['Texto Editores'],
                'disciplina_id' => $disciplinas['Matemática'],
                'ano_escolar_id' => $anosEscolares['9º Ano'],
                'tipo' => 'MANUAL',
                'titulo' => 'Matemática 9 - Xis',
                'isbn' => '978-972-0-93345-2',
                'codigo_interno' => null,
                'preco' => 27.50,
                'ativo' => true,
            ],
            // 9º Ano - Físico-Química
            [
                'editora_id' => $editoras['Leya Educação'],
                'disciplina_id' => $disciplinas['Físico-Química'],
                'ano_escolar_id' => $anosEscolares['9º Ano'],
                'tipo' => 'MANUAL',
                'titulo' => 'FQ 9 - Universo da Matéria',
                'isbn' => '978-972-0-93345-3',
                'codigo_interno' => '937650',
                'preco' => 23.80,
                'ativo' => true,
            ],

            // 10º Ano - Filosofia
            [
                'editora_id' => $editoras['Porto Editora'],
                'disciplina_id' => $disciplinas['Filosofia'],
                'ano_escolar_id' => $anosEscolares['10º Ano'],
                'tipo' => 'MANUAL',
                'titulo' => 'Filosofia 10 - Pensar Azul',
                'isbn' => '978-972-0-10345-1',
                'codigo_interno' => null,
                'preco' => 24.50,
                'ativo' => true,
            ],
            // 10º Ano - Biologia
            [
                'editora_id' => $editoras['Areal Editores'],
                'disciplina_id' => $disciplinas['Biologia'],
                'ano_escolar_id' => $anosEscolares['10º Ano'],
                'tipo' => 'MANUAL',
                'titulo' => 'Biologia e Geologia 10',
                'isbn' => '978-972-0-10345-2',
                'codigo_interno' => '1045231',
                'preco' => 28.90,
                'ativo' => true,
            ],

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
            ],
        ];

        foreach ($livros as $livro) {
            Livro::create($livro);
        }
    }
}
