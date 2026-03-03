<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            'company_nome'     => 'Papelock',
            'company_morada'   => 'Rua das Papelarias, 42 - 2700-000 Amadora',
            'company_telefone' => '+351 912 345 678',
            'company_email'    => 'geral@papelock.pt',
            'company_nif'      => '124124881',
            'company_logo_url' => '/images/Papelock_logo.png',
        ];

        foreach ($defaults as $key => $value) {
            Setting::set($key, $value);
        }
    }
}
