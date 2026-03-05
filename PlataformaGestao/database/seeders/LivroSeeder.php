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
        $e = Editora::all()->pluck('id', 'nome');
        $d = Disciplina::all()->pluck('id', 'nome');
        $a = AnoEscolar::all()->pluck('id', 'name');

        $pe  = $e['Porto Editora'];
        $te  = $e['Texto Editores'];
        $le  = $e['Leya Educação'];
        $ae  = $e['Areal Editores'];
        $san = $e['Santillana'];

        $por = $d['Português'];
        $mat = $d['Matemática'];
        $em  = $d['Estudo do Meio'];
        $ing = $d['Inglês'];
        $cn  = $d['Ciências Naturais'];
        $fq  = $d['Físico-Química'];
        $his = $d['História'];
        $geo = $d['Geografia'];
        $ev  = $d['Educação Visual'];
        $fil = $d['Filosofia'];
        $bio = $d['Biologia'];
        $eco = $d['Economia'];

        // [editora_id, disciplina_id, ano_escolar_id, tipo, titulo, isbn, codigo_interno, preco]
        $M = 'MANUAL';
        $C = 'CADERNO_ATIVIDADES';

        $livros = [

            // ─── 1º ANO ───────────────────────────────────────────────────────
            [$pe,  $por, $a['1º Ano'], $M, 'Pasta Mágica Português 1',              '978-972-01-01-11', '010111', 18.50],
            [$te,  $por, $a['1º Ano'], $M, 'Alfa Português 1',                      '978-972-01-01-21', '010121', 17.90],
            [$le,  $por, $a['1º Ano'], $M, 'Pirilampo Português 1',                 '978-972-01-01-31', '010131', 17.50],
            [$pe,  $por, $a['1º Ano'], $C, 'Caderno de Atividades Português 1',     '978-972-01-01-12', '010112',  8.90],
            [$te,  $mat, $a['1º Ano'], $M, 'A Grande Aventura Matemática 1',        '978-972-01-02-21', '010221', 19.20],
            [$ae,  $mat, $a['1º Ano'], $M, 'Mais! Matemática 1',                    '978-972-01-02-41', '010241', 18.00],
            [$san, $mat, $a['1º Ano'], $M, 'Matemática em Ação 1',                  '978-972-01-02-51', '010251', 17.80],
            [$te,  $mat, $a['1º Ano'], $C, 'Caderno de Atividades Matemática 1',    '978-972-01-02-22', '010222',  7.50],
            [$le,  $em,  $a['1º Ano'], $M, 'Alfa Estudo do Meio 1',                 '978-972-01-03-31', '010331', 16.80],
            [$san, $em,  $a['1º Ano'], $M, 'Mundo das Maravilhas Estudo do Meio 1', '978-972-01-03-51', '010351', 16.50],
            [$pe,  $em,  $a['1º Ano'], $M, 'Crescer Estudo do Meio 1',              '978-972-01-03-11', '010311', 16.30],

            // ─── 2º ANO ───────────────────────────────────────────────────────
            [$pe,  $por, $a['2º Ano'], $M, 'Pasta Mágica Português 2',              '978-972-02-01-11', '020111', 18.90],
            [$te,  $por, $a['2º Ano'], $M, 'Alfa Português 2',                      '978-972-02-01-21', '020121', 18.30],
            [$le,  $por, $a['2º Ano'], $M, 'Pirilampo Português 2',                 '978-972-02-01-31', '020131', 18.00],
            [$pe,  $por, $a['2º Ano'], $C, 'Caderno de Atividades Português 2',     '978-972-02-01-12', '020112',  9.20],
            [$te,  $mat, $a['2º Ano'], $M, 'A Grande Aventura Matemática 2',        '978-972-02-02-21', '020221', 19.50],
            [$ae,  $mat, $a['2º Ano'], $M, 'Mais! Matemática 2',                    '978-972-02-02-41', '020241', 18.50],
            [$san, $mat, $a['2º Ano'], $M, 'Matemática em Ação 2',                  '978-972-02-02-51', '020251', 18.30],
            [$ae,  $mat, $a['2º Ano'], $C, 'Caderno de Atividades Matemática 2',    '978-972-02-02-42', '020242',  7.90],
            [$le,  $em,  $a['2º Ano'], $M, 'Alfa Estudo do Meio 2',                 '978-972-02-03-31', '020331', 17.20],
            [$san, $em,  $a['2º Ano'], $M, 'Mundo das Maravilhas Estudo do Meio 2', '978-972-02-03-51', '020351', 16.90],
            [$pe,  $em,  $a['2º Ano'], $M, 'Crescer Estudo do Meio 2',              '978-972-02-03-11', '020311', 16.70],

            // ─── 3º ANO ───────────────────────────────────────────────────────
            [$pe,  $por, $a['3º Ano'], $M, 'Pasta Mágica Português 3',              '978-972-03-01-11', '030111', 19.20],
            [$te,  $por, $a['3º Ano'], $M, 'Alfa Português 3',                      '978-972-03-01-21', '030121', 18.70],
            [$le,  $por, $a['3º Ano'], $M, 'Pirilampo Português 3',                 '978-972-03-01-31', '030131', 18.40],
            [$pe,  $por, $a['3º Ano'], $C, 'Caderno de Atividades Português 3',     '978-972-03-01-12', '030112',  9.50],
            [$te,  $mat, $a['3º Ano'], $M, 'A Grande Aventura Matemática 3',        '978-972-03-02-21', '030221', 20.10],
            [$ae,  $mat, $a['3º Ano'], $M, 'Mais! Matemática 3',                    '978-972-03-02-41', '030241', 19.50],
            [$san, $mat, $a['3º Ano'], $M, 'Matemática em Ação 3',                  '978-972-03-02-51', '030251', 19.20],
            [$le,  $em,  $a['3º Ano'], $M, 'Alfa Estudo do Meio 3',                 '978-972-03-03-31', '030331', 17.50],
            [$san, $em,  $a['3º Ano'], $M, 'Mundo das Maravilhas Estudo do Meio 3', '978-972-03-03-51', '030351', 17.20],
            [$pe,  $em,  $a['3º Ano'], $M, 'Crescer Estudo do Meio 3',              '978-972-03-03-11', '030311', 17.00],
            [$ae,  $ing, $a['3º Ano'], $M, 'Hello! 3',                              '978-972-03-04-41', '030441', 16.80],
            [$san, $ing, $a['3º Ano'], $M, 'English Steps 3',                       '978-972-03-04-51', '030451', 16.50],
            [$te,  $ing, $a['3º Ano'], $M, 'It\'s a Wonderful World 3',             '978-972-03-04-21', '030421', 16.30],

            // ─── 4º ANO ───────────────────────────────────────────────────────
            [$pe,  $por, $a['4º Ano'], $M, 'Pasta Mágica Português 4',              '978-972-04-01-11', '040111', 19.50],
            [$te,  $por, $a['4º Ano'], $M, 'Alfa Português 4',                      '978-972-04-01-21', '040121', 19.00],
            [$le,  $por, $a['4º Ano'], $M, 'Pirilampo Português 4',                 '978-972-04-01-31', '040131', 18.70],
            [$pe,  $por, $a['4º Ano'], $C, 'Caderno de Atividades Português 4',     '978-972-04-01-12', '040112',  9.80],
            [$te,  $mat, $a['4º Ano'], $M, 'A Grande Aventura Matemática 4',        '978-972-04-02-21', '040221', 20.50],
            [$ae,  $mat, $a['4º Ano'], $M, 'Mais! Matemática 4',                    '978-972-04-02-41', '040241', 20.00],
            [$san, $mat, $a['4º Ano'], $M, 'Matemática em Ação 4',                  '978-972-04-02-51', '040251', 19.80],
            [$le,  $em,  $a['4º Ano'], $M, 'Alfa Estudo do Meio 4',                 '978-972-04-03-31', '040331', 17.90],
            [$san, $em,  $a['4º Ano'], $M, 'Mundo das Maravilhas Estudo do Meio 4', '978-972-04-03-51', '040351', 17.60],
            [$pe,  $em,  $a['4º Ano'], $M, 'Crescer Estudo do Meio 4',              '978-972-04-03-11', '040311', 17.40],
            [$ae,  $ing, $a['4º Ano'], $M, 'Hello! 4',                              '978-972-04-04-41', '040441', 17.20],
            [$san, $ing, $a['4º Ano'], $M, 'English Steps 4',                       '978-972-04-04-51', '040451', 16.90],
            [$te,  $ing, $a['4º Ano'], $M, 'It\'s a Wonderful World 4',             '978-972-04-04-21', '040421', 16.70],
            [$ae,  $ing, $a['4º Ano'], $C, 'Hello! 4 Workbook',                     '978-972-04-04-42', '040442', 10.50],

            // ─── 5º ANO ───────────────────────────────────────────────────────
            [$pe,  $por, $a['5º Ano'], $M, 'Diálogos Português 5',                  '978-972-05-01-11', '050111', 22.50],
            [$te,  $por, $a['5º Ano'], $M, 'Plural Português 5',                    '978-972-05-01-21', '050121', 21.90],
            [$le,  $por, $a['5º Ano'], $M, 'Entre Palavras Português 5',            '978-972-05-01-31', '050131', 21.60],
            [$pe,  $por, $a['5º Ano'], $C, 'Caderno de Atividades Português 5',     '978-972-05-01-12', '050112',  9.90],
            [$te,  $mat, $a['5º Ano'], $M, 'Novo Matemática 5',                     '978-972-05-02-21', '050221', 23.00],
            [$ae,  $mat, $a['5º Ano'], $M, 'Pi Matemática 5',                       '978-972-05-02-41', '050241', 22.50],
            [$san, $mat, $a['5º Ano'], $M, 'Números e Funções 5',                   '978-972-05-02-51', '050251', 22.20],
            [$te,  $mat, $a['5º Ano'], $C, 'Caderno de Atividades Matemática 5',    '978-972-05-02-22', '050222', 10.50],
            [$ae,  $ing, $a['5º Ano'], $M, 'English Plus 5',                        '978-972-05-04-41', '050441', 21.50],
            [$san, $ing, $a['5º Ano'], $M, 'Steps 5',                               '978-972-05-04-51', '050451', 21.00],
            [$te,  $ing, $a['5º Ano'], $M, 'Click On 5',                            '978-972-05-04-21', '050421', 20.80],
            [$ae,  $ing, $a['5º Ano'], $C, 'English Plus 5 Workbook',               '978-972-05-04-42', '050442', 10.50],
            [$pe,  $cn,  $a['5º Ano'], $M, 'Descobrir a Terra CN 5',                '978-972-05-05-11', '050511', 20.80],
            [$le,  $cn,  $a['5º Ano'], $M, 'Viva a Terra CN 5',                     '978-972-05-05-31', '050531', 20.30],
            [$san, $cn,  $a['5º Ano'], $M, 'Maravilhas da Natureza CN 5',           '978-972-05-05-51', '050551', 20.00],
            [$pe,  $his, $a['5º Ano'], $M, 'História e Geografia de Portugal 5 PE', '978-972-05-07-11', '050711', 19.90],
            [$te,  $his, $a['5º Ano'], $M, 'História e Geografia de Portugal 5 TE', '978-972-05-07-21', '050721', 19.40],
            [$ae,  $his, $a['5º Ano'], $M, 'História e Geografia de Portugal 5 AE', '978-972-05-07-41', '050741', 19.10],
            [$pe,  $ev,  $a['5º Ano'], $M, 'Educação Visual 5',                     '978-972-05-09-11', '050911', 16.50],
            [$ae,  $ev,  $a['5º Ano'], $M, 'Ver e Criar EV 5',                      '978-972-05-09-41', '050941', 16.00],

            // ─── 6º ANO ───────────────────────────────────────────────────────
            [$pe,  $por, $a['6º Ano'], $M, 'Diálogos Português 6',                  '978-972-06-01-11', '060111', 22.90],
            [$te,  $por, $a['6º Ano'], $M, 'Plural Português 6',                    '978-972-06-01-21', '060121', 22.30],
            [$le,  $por, $a['6º Ano'], $M, 'Entre Palavras Português 6',            '978-972-06-01-31', '060131', 22.00],
            [$pe,  $por, $a['6º Ano'], $C, 'Caderno de Atividades Português 6',     '978-972-06-01-12', '060112', 10.20],
            [$te,  $mat, $a['6º Ano'], $M, 'Novo Matemática 6',                     '978-972-06-02-21', '060221', 23.50],
            [$ae,  $mat, $a['6º Ano'], $M, 'Pi Matemática 6',                       '978-972-06-02-41', '060241', 23.00],
            [$san, $mat, $a['6º Ano'], $M, 'Números e Funções 6',                   '978-972-06-02-51', '060251', 22.70],
            [$te,  $mat, $a['6º Ano'], $C, 'Caderno de Atividades Matemática 6',    '978-972-06-02-22', '060222', 10.80],
            [$ae,  $ing, $a['6º Ano'], $M, 'English Plus 6',                        '978-972-06-04-41', '060441', 21.90],
            [$san, $ing, $a['6º Ano'], $M, 'Steps 6',                               '978-972-06-04-51', '060451', 21.40],
            [$te,  $ing, $a['6º Ano'], $M, 'Click On 6',                            '978-972-06-04-21', '060421', 21.20],
            [$ae,  $ing, $a['6º Ano'], $C, 'English Plus 6 Workbook',               '978-972-06-04-42', '060442', 11.00],
            [$pe,  $cn,  $a['6º Ano'], $M, 'Descobrir a Terra CN 6',                '978-972-06-05-11', '060511', 21.20],
            [$le,  $cn,  $a['6º Ano'], $M, 'Viva a Terra CN 6',                     '978-972-06-05-31', '060531', 20.70],
            [$san, $cn,  $a['6º Ano'], $M, 'Maravilhas da Natureza CN 6',           '978-972-06-05-51', '060551', 20.40],
            [$pe,  $his, $a['6º Ano'], $M, 'História e Geografia de Portugal 6 PE', '978-972-06-07-11', '060711', 20.50],
            [$te,  $his, $a['6º Ano'], $M, 'História e Geografia de Portugal 6 TE', '978-972-06-07-21', '060721', 20.00],
            [$ae,  $his, $a['6º Ano'], $M, 'História e Geografia de Portugal 6 AE', '978-972-06-07-41', '060741', 19.70],
            [$pe,  $ev,  $a['6º Ano'], $M, 'Educação Visual 6',                     '978-972-06-09-11', '060911', 17.00],
            [$ae,  $ev,  $a['6º Ano'], $M, 'Ver e Criar EV 6',                      '978-972-06-09-41', '060941', 16.50],

            // ─── 7º ANO ───────────────────────────────────────────────────────
            [$pe,  $por, $a['7º Ano'], $M, 'Plural Português 7 PE',                 '978-972-07-01-11', '070111', 23.50],
            [$te,  $por, $a['7º Ano'], $M, 'Expressões Português 7',                '978-972-07-01-21', '070121', 23.00],
            [$le,  $por, $a['7º Ano'], $M, 'Comunicar em Português 7',              '978-972-07-01-31', '070131', 22.70],
            [$pe,  $por, $a['7º Ano'], $C, 'Caderno de Atividades Português 7',     '978-972-07-01-12', '070112', 10.90],
            [$te,  $mat, $a['7º Ano'], $M, 'Xis Matemática 7',                      '978-972-07-02-21', '070221', 25.00],
            [$ae,  $mat, $a['7º Ano'], $M, 'Pi Matemática 7',                       '978-972-07-02-41', '070241', 24.50],
            [$san, $mat, $a['7º Ano'], $M, 'Números e Funções 7',                   '978-972-07-02-51', '070251', 24.20],
            [$te,  $mat, $a['7º Ano'], $C, 'Caderno de Atividades Matemática 7',    '978-972-07-02-22', '070222', 11.50],
            [$ae,  $ing, $a['7º Ano'], $M, 'English Plus 7',                        '978-972-07-04-41', '070441', 22.50],
            [$san, $ing, $a['7º Ano'], $M, 'Steps 7',                               '978-972-07-04-51', '070451', 22.00],
            [$te,  $ing, $a['7º Ano'], $M, 'Click On 7',                            '978-972-07-04-21', '070421', 21.80],
            [$ae,  $ing, $a['7º Ano'], $C, 'English Plus 7 Workbook',               '978-972-07-04-42', '070442', 11.50],
            [$pe,  $cn,  $a['7º Ano'], $M, 'Terra Viva CN 7',                       '978-972-07-05-11', '070511', 21.80],
            [$le,  $cn,  $a['7º Ano'], $M, 'À Descoberta CN 7',                     '978-972-07-05-31', '070531', 21.30],
            [$san, $cn,  $a['7º Ano'], $M, 'Ciências Vivas 7',                      '978-972-07-05-51', '070551', 21.00],
            [$le,  $fq,  $a['7º Ano'], $M, 'Universo da Matéria FQ 7',              '978-972-07-06-31', '070631', 22.00],
            [$ae,  $fq,  $a['7º Ano'], $M, 'Novos Horizontes FQ 7',                 '978-972-07-06-41', '070641', 21.50],
            [$pe,  $fq,  $a['7º Ano'], $M, 'FQ em Perspetiva 7',                   '978-972-07-06-11', '070611', 21.20],
            [$pe,  $his, $a['7º Ano'], $M, 'História 7 PE',                         '978-972-07-07-11', '070711', 21.50],
            [$te,  $his, $a['7º Ano'], $M, 'História 7 TE',                         '978-972-07-07-21', '070721', 21.00],
            [$san, $his, $a['7º Ano'], $M, 'História 7 Santillana',                 '978-972-07-07-51', '070751', 20.70],
            [$ae,  $geo, $a['7º Ano'], $M, 'Viajar Geografia 7',                    '978-972-07-08-41', '070841', 20.50],
            [$san, $geo, $a['7º Ano'], $M, 'Mundo em Mapas Geografia 7',            '978-972-07-08-51', '070851', 20.00],
            [$pe,  $geo, $a['7º Ano'], $M, 'Geografia em Foco 7',                   '978-972-07-08-11', '070811', 19.80],

            // ─── 8º ANO ───────────────────────────────────────────────────────
            [$pe,  $por, $a['8º Ano'], $M, 'Plural Português 8 PE',                 '978-972-08-01-11', '080111', 24.20],
            [$te,  $por, $a['8º Ano'], $M, 'Expressões Português 8',                '978-972-08-01-21', '080121', 23.70],
            [$le,  $por, $a['8º Ano'], $M, 'Comunicar em Português 8',              '978-972-08-01-31', '080131', 23.40],
            [$pe,  $por, $a['8º Ano'], $C, 'Caderno de Atividades Português 8',     '978-972-08-01-12', '080112', 11.20],
            [$te,  $mat, $a['8º Ano'], $M, 'Xis Matemática 8',                      '978-972-08-02-21', '080221', 26.00],
            [$ae,  $mat, $a['8º Ano'], $M, 'Pi Matemática 8',                       '978-972-08-02-41', '080241', 25.50],
            [$san, $mat, $a['8º Ano'], $M, 'Números e Funções 8',                   '978-972-08-02-51', '080251', 25.20],
            [$te,  $mat, $a['8º Ano'], $C, 'Caderno de Atividades Matemática 8',    '978-972-08-02-22', '080222', 12.00],
            [$ae,  $ing, $a['8º Ano'], $M, 'English Plus 8',                        '978-972-08-04-41', '080441', 23.00],
            [$san, $ing, $a['8º Ano'], $M, 'Steps 8',                               '978-972-08-04-51', '080451', 22.50],
            [$te,  $ing, $a['8º Ano'], $M, 'Click On 8',                            '978-972-08-04-21', '080421', 22.20],
            [$ae,  $ing, $a['8º Ano'], $C, 'English Plus 8 Workbook',               '978-972-08-04-42', '080442', 12.00],
            [$pe,  $cn,  $a['8º Ano'], $M, 'Terra Viva CN 8',                       '978-972-08-05-11', '080511', 22.30],
            [$le,  $cn,  $a['8º Ano'], $M, 'À Descoberta CN 8',                     '978-972-08-05-31', '080531', 21.80],
            [$san, $cn,  $a['8º Ano'], $M, 'Ciências Vivas 8',                      '978-972-08-05-51', '080551', 21.50],
            [$le,  $fq,  $a['8º Ano'], $M, 'Universo da Matéria FQ 8',              '978-972-08-06-31', '080631', 23.50],
            [$ae,  $fq,  $a['8º Ano'], $M, 'Novos Horizontes FQ 8',                 '978-972-08-06-41', '080641', 23.00],
            [$pe,  $fq,  $a['8º Ano'], $M, 'FQ em Perspetiva 8',                   '978-972-08-06-11', '080611', 22.70],
            [$pe,  $his, $a['8º Ano'], $M, 'História 8 PE',                         '978-972-08-07-11', '080711', 22.00],
            [$te,  $his, $a['8º Ano'], $M, 'História 8 TE',                         '978-972-08-07-21', '080721', 21.50],
            [$san, $his, $a['8º Ano'], $M, 'História 8 Santillana',                 '978-972-08-07-51', '080751', 21.20],
            [$ae,  $geo, $a['8º Ano'], $M, 'Viajar Geografia 8',                    '978-972-08-08-41', '080841', 21.00],
            [$san, $geo, $a['8º Ano'], $M, 'Mundo em Mapas Geografia 8',            '978-972-08-08-51', '080851', 20.50],
            [$pe,  $geo, $a['8º Ano'], $M, 'Geografia em Foco 8',                   '978-972-08-08-11', '080811', 20.20],

            // ─── 9º ANO ───────────────────────────────────────────────────────
            [$pe,  $por, $a['9º Ano'], $M, 'Plural Português 9 PE',                 '978-972-09-01-11', '090111', 25.90],
            [$te,  $por, $a['9º Ano'], $M, 'Expressões Português 9',                '978-972-09-01-21', '090121', 25.40],
            [$le,  $por, $a['9º Ano'], $M, 'Comunicar em Português 9',              '978-972-09-01-31', '090131', 25.10],
            [$pe,  $por, $a['9º Ano'], $C, 'Caderno de Atividades Português 9',     '978-972-09-01-12', '090112', 11.50],
            [$te,  $mat, $a['9º Ano'], $M, 'Xis Matemática 9',                      '978-972-09-02-21', '090221', 27.50],
            [$ae,  $mat, $a['9º Ano'], $M, 'Pi Matemática 9',                       '978-972-09-02-41', '090241', 27.00],
            [$san, $mat, $a['9º Ano'], $M, 'Números e Funções 9',                   '978-972-09-02-51', '090251', 26.70],
            [$te,  $mat, $a['9º Ano'], $C, 'Caderno de Atividades Matemática 9',    '978-972-09-02-22', '090222', 12.50],
            [$ae,  $ing, $a['9º Ano'], $M, 'English Plus 9',                        '978-972-09-04-41', '090441', 23.50],
            [$san, $ing, $a['9º Ano'], $M, 'Steps 9',                               '978-972-09-04-51', '090451', 23.00],
            [$te,  $ing, $a['9º Ano'], $M, 'Click On 9',                            '978-972-09-04-21', '090421', 22.80],
            [$ae,  $ing, $a['9º Ano'], $C, 'English Plus 9 Workbook',               '978-972-09-04-42', '090442', 12.50],
            [$pe,  $cn,  $a['9º Ano'], $M, 'Terra Viva CN 9',                       '978-972-09-05-11', '090511', 22.80],
            [$le,  $cn,  $a['9º Ano'], $M, 'À Descoberta CN 9',                     '978-972-09-05-31', '090531', 22.30],
            [$san, $cn,  $a['9º Ano'], $M, 'Ciências Vivas 9',                      '978-972-09-05-51', '090551', 22.00],
            [$le,  $fq,  $a['9º Ano'], $M, 'Universo da Matéria FQ 9',              '978-972-09-06-31', '090631', 23.80],
            [$ae,  $fq,  $a['9º Ano'], $M, 'Novos Horizontes FQ 9',                 '978-972-09-06-41', '090641', 23.30],
            [$pe,  $fq,  $a['9º Ano'], $M, 'FQ em Perspetiva 9',                   '978-972-09-06-11', '090611', 23.00],
            [$pe,  $his, $a['9º Ano'], $M, 'História 9 PE',                         '978-972-09-07-11', '090711', 22.50],
            [$te,  $his, $a['9º Ano'], $M, 'História 9 TE',                         '978-972-09-07-21', '090721', 22.00],
            [$san, $his, $a['9º Ano'], $M, 'História 9 Santillana',                 '978-972-09-07-51', '090751', 21.70],
            [$ae,  $geo, $a['9º Ano'], $M, 'Viajar Geografia 9',                    '978-972-09-08-41', '090841', 21.50],
            [$san, $geo, $a['9º Ano'], $M, 'Mundo em Mapas Geografia 9',            '978-972-09-08-51', '090851', 21.00],
            [$pe,  $geo, $a['9º Ano'], $M, 'Geografia em Foco 9',                   '978-972-09-08-11', '090811', 20.70],

            // ─── 10º ANO ──────────────────────────────────────────────────────
            [$pe,  $por, $a['10º Ano'], $M, 'Expressões Português 10 PE',            '978-972-10-01-11', '100111', 26.50],
            [$te,  $por, $a['10º Ano'], $M, 'Plural Português 10',                   '978-972-10-01-21', '100121', 26.00],
            [$le,  $por, $a['10º Ano'], $M, 'Comunicar em Português 10',             '978-972-10-01-31', '100131', 25.70],
            [$pe,  $por, $a['10º Ano'], $C, 'Caderno de Atividades Português 10',    '978-972-10-01-12', '100112', 12.00],
            [$te,  $mat, $a['10º Ano'], $M, 'Matemática A 10 TE',                    '978-972-10-02-21', '100221', 28.00],
            [$ae,  $mat, $a['10º Ano'], $M, 'Matemática A 10 Areal',                 '978-972-10-02-41', '100241', 27.50],
            [$pe,  $mat, $a['10º Ano'], $M, 'Matemática A 10 PE',                    '978-972-10-02-11', '100211', 27.20],
            [$ae,  $ing, $a['10º Ano'], $M, 'English Plus 10',                       '978-972-10-04-41', '100441', 24.00],
            [$san, $ing, $a['10º Ano'], $M, 'Steps 10',                              '978-972-10-04-51', '100451', 23.50],
            [$te,  $ing, $a['10º Ano'], $M, 'Click On 10',                           '978-972-10-04-21', '100421', 23.20],
            [$pe,  $fil, $a['10º Ano'], $M, 'Pensar Azul Filosofia 10',              '978-972-10-10-11', '101011', 24.50],
            [$te,  $fil, $a['10º Ano'], $M, 'Filosofia 10 TE',                       '978-972-10-10-21', '101021', 24.00],
            [$ae,  $fil, $a['10º Ano'], $M, 'Filosofia 10 Areal',                    '978-972-10-10-41', '101041', 23.70],
            [$le,  $bio, $a['10º Ano'], $M, 'Biologia e Geologia 10 Leya',           '978-972-10-11-31', '101131', 28.90],
            [$ae,  $bio, $a['10º Ano'], $M, 'Biologia e Geologia 10 Areal',          '978-972-10-11-41', '101141', 28.40],
            [$pe,  $bio, $a['10º Ano'], $M, 'Biologia e Geologia 10 PE',             '978-972-10-11-11', '101111', 28.10],
            [$le,  $fq,  $a['10º Ano'], $M, 'Universo da Matéria FQ 10',             '978-972-10-06-31', '100631', 27.50],
            [$ae,  $fq,  $a['10º Ano'], $M, 'Novos Horizontes FQ 10',                '978-972-10-06-41', '100641', 27.00],
            [$pe,  $fq,  $a['10º Ano'], $M, 'FQ em Perspetiva 10',                  '978-972-10-06-11', '100611', 26.70],

            // ─── 11º ANO ──────────────────────────────────────────────────────
            [$pe,  $por, $a['11º Ano'], $M, 'Expressões Português 11 PE',            '978-972-11-01-11', '110111', 26.90],
            [$te,  $por, $a['11º Ano'], $M, 'Plural Português 11',                   '978-972-11-01-21', '110121', 26.40],
            [$le,  $por, $a['11º Ano'], $M, 'Comunicar em Português 11',             '978-972-11-01-31', '110131', 26.10],
            [$pe,  $por, $a['11º Ano'], $C, 'Caderno de Atividades Português 11',    '978-972-11-01-12', '110112', 12.40],
            [$te,  $mat, $a['11º Ano'], $M, 'Matemática A 11 TE',                    '978-972-11-02-21', '110221', 29.50],
            [$ae,  $mat, $a['11º Ano'], $M, 'Matemática A 11 Areal',                 '978-972-11-02-41', '110241', 29.00],
            [$pe,  $mat, $a['11º Ano'], $M, 'Matemática A 11 PE',                    '978-972-11-02-11', '110211', 28.70],
            [$ae,  $ing, $a['11º Ano'], $M, 'English Plus 11',                       '978-972-11-04-41', '110441', 24.50],
            [$san, $ing, $a['11º Ano'], $M, 'Steps 11',                              '978-972-11-04-51', '110451', 24.00],
            [$te,  $ing, $a['11º Ano'], $M, 'Click On 11',                           '978-972-11-04-21', '110421', 23.70],
            [$pe,  $fil, $a['11º Ano'], $M, 'Pensar Azul Filosofia 11',              '978-972-11-10-11', '111011', 24.80],
            [$te,  $fil, $a['11º Ano'], $M, 'Filosofia 11 TE',                       '978-972-11-10-21', '111021', 24.30],
            [$ae,  $fil, $a['11º Ano'], $M, 'Filosofia 11 Areal',                    '978-972-11-10-41', '111041', 24.00],
            [$le,  $bio, $a['11º Ano'], $M, 'Biologia e Geologia 11 Leya',           '978-972-11-11-31', '111131', 29.40],
            [$ae,  $bio, $a['11º Ano'], $M, 'Biologia e Geologia 11 Areal',          '978-972-11-11-41', '111141', 28.90],
            [$pe,  $bio, $a['11º Ano'], $M, 'Biologia e Geologia 11 PE',             '978-972-11-11-11', '111111', 28.60],
            [$le,  $fq,  $a['11º Ano'], $M, 'Universo da Matéria FQ 11',             '978-972-11-06-31', '110631', 28.00],
            [$ae,  $fq,  $a['11º Ano'], $M, 'Novos Horizontes FQ 11',                '978-972-11-06-41', '110641', 27.50],
            [$pe,  $fq,  $a['11º Ano'], $M, 'FQ em Perspetiva 11',                  '978-972-11-06-11', '110611', 27.20],

            // ─── 12º ANO ──────────────────────────────────────────────────────
            [$pe,  $por, $a['12º Ano'], $M, 'Expressões Português 12 PE',            '978-972-12-01-11', '120111', 27.50],
            [$te,  $por, $a['12º Ano'], $M, 'Plural Português 12',                   '978-972-12-01-21', '120121', 27.00],
            [$le,  $por, $a['12º Ano'], $M, 'Comunicar em Português 12',             '978-972-12-01-31', '120131', 26.70],
            [$pe,  $por, $a['12º Ano'], $C, 'Caderno de Atividades Português 12',    '978-972-12-01-12', '120112', 12.90],
            [$te,  $mat, $a['12º Ano'], $M, 'Matemática A 12 TE',                    '978-972-12-02-21', '120221', 30.00],
            [$ae,  $mat, $a['12º Ano'], $M, 'Matemática A 12 Areal',                 '978-972-12-02-41', '120241', 29.50],
            [$pe,  $mat, $a['12º Ano'], $M, 'Matemática A 12 PE',                    '978-972-12-02-11', '120211', 29.20],
            [$ae,  $ing, $a['12º Ano'], $M, 'English Plus 12',                       '978-972-12-04-41', '120441', 25.00],
            [$san, $ing, $a['12º Ano'], $M, 'Steps 12',                              '978-972-12-04-51', '120451', 24.50],
            [$te,  $ing, $a['12º Ano'], $M, 'Click On 12',                           '978-972-12-04-21', '120421', 24.20],
            [$le,  $bio, $a['12º Ano'], $M, 'Biologia 12 Leya',                      '978-972-12-11-31', '121131', 29.90],
            [$ae,  $bio, $a['12º Ano'], $M, 'Biologia 12 Areal',                     '978-972-12-11-41', '121141', 29.40],
            [$pe,  $bio, $a['12º Ano'], $M, 'Biologia 12 PE',                        '978-972-12-11-11', '121111', 29.10],
            [$le,  $fq,  $a['12º Ano'], $M, 'Universo da Matéria FQ 12',             '978-972-12-06-31', '120631', 30.00],
            [$ae,  $fq,  $a['12º Ano'], $M, 'Novos Horizontes FQ 12',                '978-972-12-06-41', '120641', 29.50],
            [$pe,  $fq,  $a['12º Ano'], $M, 'FQ em Perspetiva 12',                  '978-972-12-06-11', '120611', 29.20],
            [$pe,  $eco, $a['12º Ano'], $M, 'Economia 12 PE',                        '978-972-12-12-11', '121211', 28.50],
            [$san, $eco, $a['12º Ano'], $M, 'Economia 12 Santillana',                '978-972-12-12-51', '121251', 28.00],
            [$te,  $eco, $a['12º Ano'], $M, 'Economia 12 TE',                        '978-972-12-12-21', '121221', 27.70],
        ];

        foreach ($livros as [$editoraId, $disciplinaId, $anoEscolarId, $tipo, $titulo, $isbn, $codigo, $preco]) {
            Livro::create([
                'editora_id'     => $editoraId,
                'disciplina_id'  => $disciplinaId,
                'ano_escolar_id' => $anoEscolarId,
                'tipo'           => $tipo,
                'titulo'         => $titulo,
                'isbn'           => $isbn,
                'codigo_interno' => $codigo,
                'preco'          => $preco,
                'ativo'          => true,
            ]);
        }
    }
}
