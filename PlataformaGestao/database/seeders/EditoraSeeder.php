<?php

namespace Database\Seeders;

use App\Models\Editora;
use Illuminate\Database\Seeder;

class EditoraSeeder extends Seeder
{
    public function run(): void
    {
        $editoras = [
            [
                'nome' => 'Porto Editora',
                'codigo' => 'PE',
                'contacto_email' => 'encomendas@portoeditora.pt',
                'contacto_telefone' => '222081700',
            ],
            [
                'nome' => 'Texto Editores',
                'codigo' => 'TE',
                'contacto_email' => 'encomendas@textoeditores.pt',
                'contacto_telefone' => '214724500',
            ],
            [
                'nome' => 'Leya Educação',
                'codigo' => 'LEYA',
                'contacto_email' => 'educacao@leya.pt',
                'contacto_telefone' => '214228800',
            ],
            [
                'nome' => 'Areal Editores',
                'codigo' => 'AE',
                'contacto_email' => 'areal@arealeditores.pt',
                'contacto_telefone' => '226165230',
            ],
            [
                'nome' => 'Santillana',
                'codigo' => 'SANT',
                'contacto_email' => 'geral@santillana.pt',
                'contacto_telefone' => '213821400',
            ],
            [
                'nome' => 'Raiz Editora',
                'codigo' => 'RAIZ',
                'contacto_email' => 'info@raizeditora.pt',
                'contacto_telefone' => '222081750',
            ],
            [
                'nome' => 'ASA',
                'codigo' => 'ASA',
                'contacto_email' => 'asa@asa.pt',
                'contacto_telefone' => '226166990',
            ],
        ];

        foreach ($editoras as $editora) {
            Editora::create($editora);
        }
    }
}
