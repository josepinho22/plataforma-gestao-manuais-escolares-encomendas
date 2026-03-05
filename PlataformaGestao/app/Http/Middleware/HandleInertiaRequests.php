<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Setting;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
   public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'auth' => [
            'user' => $request->user(),
        ],
        'flash' => [
            'success' => fn () => $request->session()->get('success'),
            'error'   => fn () => $request->session()->get('error'),
        ],
        'companySettings' => fn () => [
            'nome'     => Setting::get('company_nome', 'Papelock'),
            'morada'   => Setting::get('company_morada', ''),
            'telefone' => Setting::get('company_telefone', ''),
            'email'    => Setting::get('company_email', ''),
            'nif'      => Setting::get('company_nif', ''),
            'logo_url' => Setting::get('company_logo_url', '/images/Papelock_logo.png'),
        ],
    ];
}
}
