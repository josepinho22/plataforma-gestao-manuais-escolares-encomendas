<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CompanySettingsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\EncomendasEditoraController;
use App\Http\Controllers\CatalogoLivrosController;
use App\Http\Controllers\EscolasController;
use App\Http\Controllers\AlunosController;
use App\Http\Controllers\ManuaisController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\LivroController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



// 1. Rota Raiz - Redireciona diretamente para o Login
Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ---------- ENCOMENDAS (Clientes) ----------
    Route::get('/encomendas/clientes', [OrderController::class, 'index'])
        ->name('orders.clientes.index');

    Route::get('/encomendas/clientes/create', [OrderController::class, 'create'])->name('orders.create');
    Route::post('/encomendas/clientes', [OrderController::class, 'store'])->name('orders.store');

    // APIs para suporte à criação de encomendas
    Route::get('/api/students/lookup', [OrderController::class, 'studentLookup'])->name('api.students.lookup');
    Route::get('/api/books/search', [OrderController::class, 'searchBooks'])->name('api.books.search');
    Route::get('/api/books/all-search', [OrderController::class, 'searchAllBooks'])->name('api.books.allSearch');

    // APIs para processamento de encomendas
    Route::patch('/api/orders/{orderId}/items/{itemId}', [OrderController::class, 'updateItem'])->name('api.orders.updateItem');
    Route::patch('/api/orders/{orderId}/items/{itemId}/edit', [OrderController::class, 'editItem'])->name('api.orders.editItem');
    Route::delete('/api/orders/{orderId}/items/{itemId}', [OrderController::class, 'deleteItem'])->name('api.orders.deleteItem');
    Route::post('/api/orders/{orderId}/normalize-items', [OrderController::class, 'normalizeItems'])->name('api.orders.normalizeItems');
    Route::get('/api/orders/{orderId}/history', [OrderController::class, 'getHistory'])->name('api.orders.history');
    Route::get('/api/orders/{orderId}/pdf', [OrderController::class, 'printPDF'])->name('api.orders.pdf');
    Route::delete('/api/orders/{orderId}', [OrderController::class, 'destroy'])->name('api.orders.destroy');

    // ---------- ENCOMENDAS (Editora) ----------
    Route::get('/encomendas/editora', [EncomendasEditoraController::class, 'index'])
        ->name('orders.editora.index');

    Route::post('/encomendas/editora', [EncomendasEditoraController::class, 'store'])
        ->name('orders.editora.store');

    Route::post('/encomendas/editora/receber', [EncomendasEditoraController::class, 'receive'])
        ->name('orders.editora.receive');

    Route::get('/encomendas/editora/export', [EncomendasEditoraController::class, 'export'])
        ->name('orders.editora.export');

    // ---------- CATÁLOGO ----------
    Route::get('/catalogo/livros', [CatalogoLivrosController::class, 'index'])
        ->name('catalogo.livros.index');

    Route::get('/api/catalogo/livros/check-isbn', [CatalogoLivrosController::class, 'checkIsbn'])
        ->name('catalogo.livros.checkIsbn');

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

    // Dados da empresa
    Route::patch('/settings/company', [CompanySettingsController::class, 'update'])->name('settings.company.update');
});

Route::middleware(['auth', 'verified'])->group(function () {

    // ---------- STOCK ----------
    Route::get('/stock', [StockController::class, 'index'])->name('stock.index');
    Route::post('/stock/adjust', [StockController::class, 'adjust'])->name('stock.adjust');
    Route::post('/stock/add', [StockController::class, 'add'])->name('stock.add');

    // Livros - search endpoint (AJAX)
    Route::get('/livros/search', [LivroController::class, 'search'])->name('livros.search');

    // ---------- MANUAIS ----------
    Route::get('/manuais-list', [ManuaisController::class, 'index'])->name('manuais.index');
    Route::get('/api/get-lista-manuais', [ManuaisController::class, 'getListaBooks'])->name('api.lista.manuais');
    Route::post('/manuais-list', [ManuaisController::class, 'store'])->name('manuais-lists.store');

    // ---------- GESTÃO (Concelhos + Editoras) ----------
    Route::get('/gestao', function () {
        return \Inertia\Inertia::render('Gestao/Index');
    })->name('gestao.index');

    Route::get('/concelhos', [\App\Http\Controllers\ConcelhosController::class, 'index'])->name('concelhos.index');
    Route::post('/concelhos', [\App\Http\Controllers\ConcelhosController::class, 'store'])->name('concelhos.store');
    Route::put('/concelhos/{concelho}', [\App\Http\Controllers\ConcelhosController::class, 'update'])->name('concelhos.update');
    Route::delete('/concelhos/{concelho}', [\App\Http\Controllers\ConcelhosController::class, 'destroy'])->name('concelhos.destroy');

    Route::get('/editoras', [\App\Http\Controllers\EditorasController::class, 'index'])->name('editoras.index');
    Route::post('/editoras', [\App\Http\Controllers\EditorasController::class, 'store'])->name('editoras.store');
    Route::put('/editoras/{editora}', [\App\Http\Controllers\EditorasController::class, 'update'])->name('editoras.update');
    Route::delete('/editoras/{editora}', [\App\Http\Controllers\EditorasController::class, 'destroy'])->name('editoras.destroy');

    Route::post('/disciplinas', [\App\Http\Controllers\DisciplinasController::class, 'store'])->name('disciplinas.store');
    Route::put('/disciplinas/{disciplina}', [\App\Http\Controllers\DisciplinasController::class, 'update'])->name('disciplinas.update');
    Route::delete('/disciplinas/{disciplina}', [\App\Http\Controllers\DisciplinasController::class, 'destroy'])->name('disciplinas.destroy');

    Route::post('/anos-letivos/avancar', [\App\Http\Controllers\AnosLetivosController::class, 'avancar'])->name('anos-letivos.avancar');
    Route::post('/anos-letivos', [\App\Http\Controllers\AnosLetivosController::class, 'store'])->name('anos-letivos.store');
    Route::put('/anos-letivos/{anoLetivo}', [\App\Http\Controllers\AnosLetivosController::class, 'update'])->name('anos-letivos.update');
    Route::delete('/anos-letivos/{anoLetivo}', [\App\Http\Controllers\AnosLetivosController::class, 'destroy'])->name('anos-letivos.destroy');
});


require __DIR__ . '/auth.php';