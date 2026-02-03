<?php

namespace App\Http\Controllers;

use App\Models\Concelho;
use App\Models\Livro;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LivroController extends Controller
{
    public function index(Request $request)
    {

        $query = Livro::with(['anoEscolar', 'editora', 'disciplina']);

        if (method_exists(Livro::class, 'anoLetivo')) {
            $query->with('anoLetivo');
        }

        if ($request->has('ano_letivo_id')) {
            $query->where('ano_letivo_id', $request->ano_letivo_id);
        }

        if ($request->has('ano_escolar_id')) {
            $query->where('ano_escolar_id', $request->ano_escolar_id);
        }

        return Inertia::render('Books/Index', [
    'lists' => [],
    'concelhos' => [],
    'filters' => []
]);
    }
}
