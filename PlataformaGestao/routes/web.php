<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\LivroController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;

// 1. Rota Pública
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// 2. Rotas Protegidas (Todas as rotas do Papelix devem estar aqui dentro)
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Encomendas (Nomes exatos exigidos pela Sidebar)
    Route::get('/encomendas/clientes', [OrderController::class, 'index'])->name('orders.clientes.index');
    Route::get('/encomendas/editora', [OrderController::class, 'index'])->name('orders.editora.index');
    Route::get('/encomendas', [OrderController::class, 'index'])->name('orders.index');

    // Catálogo (Nome exato exigido pela Sidebar)
    Route::get('/catalogo/livros', [LivroController::class, 'index'])->name('catalogo.livros.index');
    Route::get('/books-list', [LivroController::class, 'index'])->name('books.index');
    Route::get('/api/get-lista-books', [LivroController::class, 'getListaBooks'])->name('api.lista.books');
    Route::post('/catalogo/livros', [LivroController::class, 'store'])->name('book-lists.store');
    
    // Perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
