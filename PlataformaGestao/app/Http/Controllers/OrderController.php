<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        // 1. Dados dos Cartões de Topo
        $stats = [
            'pendentes' => 1,
            'processamento' => 0,
            'concluidas' => 1,
        ];

        
        $orders = [
            [
                'id' => 1,
                'status' => 'pendente', 
                'student_name' => 'João Silva',
                'school' => 'Escola Básica de Exemplo',
                'year' => '5º Ano',
                'date' => '14/01/2025',
                'total' => '60.80',
                'items' => [
                    ['title' => 'Matemática 5', 'quantity' => 2, 'price' => 31.80],
                    ['title' => 'Português 5', 'quantity' => 2, 'price' => 29.00],
                ]
            ],
            [
                'id' => 2,
                'status' => 'concluida',
                'student_name' => 'Maria Santos',
                'school' => 'Escola Secundária Central',
                'year' => '7º Ano',
                'date' => '12/01/2025',
                'total' => '18.50',
                'items' => [
                    ['title' => 'Inglês 7', 'quantity' => 1, 'price' => 18.50],
                ]
            ]
        ];

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'stats' => $stats
        ]);
    }
}
