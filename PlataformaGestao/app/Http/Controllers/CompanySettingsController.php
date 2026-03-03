<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;

class CompanySettingsController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'nome'     => 'required|string|max:255',
            'morada'   => 'nullable|string|max:500',
            'telefone' => 'nullable|string|max:50',
            'email'    => 'nullable|email|max:255',
            'nif'      => 'nullable|string|max:50',
            'logo_url' => 'nullable|string|max:500',
        ]);

        foreach ($validated as $key => $value) {
            Setting::set('company_' . $key, $value);
        }

        return back()->with('success', 'Dados da empresa atualizados com sucesso.');
    }
}
