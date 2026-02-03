<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin',
                'email' => 'admin@papelaria.pt',
                'password' => Hash::make('admin@papelaria.pt'),
            ],
            [
                'name' => 'Maria Silva',
                'email' => 'maria.silva@papelaria.pt',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'João Santos',
                'email' => 'joao.santos@papelaria.pt',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Ana Ferreira',
                'email' => 'ana.ferreira@papelaria.pt',
                'password' => Hash::make('password'),
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
