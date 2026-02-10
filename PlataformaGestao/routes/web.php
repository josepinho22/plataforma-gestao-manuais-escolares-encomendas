<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\EncomendasEditoraController;
use App\Http\Controllers\CatalogoLivrosController;
use App\Http\Controllers\EscolasController;
use App\Http\Controllers\AlunosController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\LivroController;


// 1. Rota Pública
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // ---------- ENCOMENDAS (Clientes) ----------
    Route::get('/encomendas/clientes', [OrderController::class, 'index'])
        ->name('orders.clientes.index');

    Route::get('/encomendas', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/encomendas/create', [OrderController::class, 'create'])->name('orders.create');
    Route::post('/encomendas', [OrderController::class, 'store'])->name('orders.store');

    // APIs para suporte à criação de encomendas
    Route::get('/api/students/lookup', [OrderController::class, 'studentLookup'])->name('api.students.lookup');
    Route::get('/api/books/search', [OrderController::class, 'searchBooks'])->name('api.books.search');

    // APIs para processamento de encomendas
    Route::patch('/api/orders/{orderId}/items/{itemId}', [OrderController::class, 'updateItem'])->name('api.orders.updateItem');
    Route::get('/api/orders/{orderId}/history', [OrderController::class, 'getHistory'])->name('api.orders.history');

    // ---------- ENCOMENDAS (Editora) ----------
    Route::get('/encomendas/editora', [EncomendasEditoraController::class, 'index'])
        ->name('orders.editora.index');

    Route::post('/encomendas/editora', [EncomendasEditoraController::class, 'store'])
        ->name('orders.editora.store');

    Route::post('/encomendas/editora/receber', [EncomendasEditoraController::class, 'receive'])
        ->name('orders.editora.receive');

    // ---------- CATÁLOGO ----------
    Route::get('/catalogo/livros', [CatalogoLivrosController::class, 'index'])
        ->name('catalogo.livros.index');

    Route::post('/catalogo/livros', [CatalogoLivrosController::class, 'store'])
        ->name('catalogo.livros.store');

    Route::put('/catalogo/livros/{livro}', [CatalogoLivrosController::class, 'update'])
        ->name('catalogo.livros.update');

    Route::patch('/catalogo/livros/{livro}/toggle', [CatalogoLivrosController::class, 'toggleActive'])
        ->name('catalogo.livros.toggle');

    Route::delete('/catalogo/livros/{livro}', [CatalogoLivrosController::class, 'destroy'])
        ->name('catalogo.livros.destroy');

    // ---------- ESCOLAS ----------
    Route::get('/escolas', [EscolasController::class, 'index'])
        ->name('escolas.index');

    Route::post('/escolas', [EscolasController::class, 'store'])
        ->name('escolas.store');

    Route::put('/escolas/{escola}', [EscolasController::class, 'update'])
        ->name('escolas.update');

    Route::patch('/escolas/{escola}/toggle', [EscolasController::class, 'toggleActive'])
        ->name('escolas.toggle');

    Route::delete('/escolas/{escola}', [EscolasController::class, 'destroy'])
        ->name('escolas.destroy');

// ---------- ALUNOS ----------
Route::get('/alunos', [AlunosController::class, 'index'])->name('alunos.index');
Route::post('/alunos', [AlunosController::class, 'store'])->name('alunos.store');
Route::put('/alunos/{aluno}', [AlunosController::class, 'update'])->name('alunos.update');
});

Route::middleware('auth')->group(function () {
    // Perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
// 2. Rotas Protegidas (Todas as rotas do Papelix devem estar aqui dentro)
Route::middleware(['auth', 'verified'])->group(function () {
    


    // Catálogo (Nome exato exigido pela Sidebar)
    //Route::get('/catalogo/livros', [LivroController::class, 'index'])->name('catalogo.livros.index');
    Route::get('/books-list', [LivroController::class, 'index'])->name('books.index');
    Route::get('/api/get-lista-books', [LivroController::class, 'getListaBooks'])->name('api.lista.books');
    Route::post('/catalogo/livros', [LivroController::class, 'store'])->name('book-lists.store');
    });


require __DIR__ . '/auth.php';