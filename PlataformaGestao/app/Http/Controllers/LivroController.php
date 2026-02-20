<?php

namespace App\Http\Controllers;

use App\Models\Livro;
use Illuminate\Http\Request;

class LivroController extends Controller
{
    public function search(Request $request)
    {
        $q = $request->string('q')->toString();

        if (strlen($q) < 2) {
            return response()->json([]);
        }

        $livros = Livro::query()
            ->where(function ($query) use ($q) {
                $query->where('titulo', 'like', "%{$q}%")
                      ->orWhere('isbn', 'like', "%{$q}%");
            })
            ->limit(10)
            ->get(['id', 'titulo', 'isbn']);

        return response()->json($livros);
    }
}
