<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('livros', function (Blueprint $table) {
            $table->tinyInteger('status_alerta')->default(0)->after('ativo');
        });

        $currentYear = now()->year;

        // Todos começam a vermelho
        DB::table('livros')->whereNull('deleted_at')->update(['status_alerta' => 2]);

        // Ano anterior → laranja
        DB::table('livros')
            ->whereNull('deleted_at')
            ->whereYear('updated_at', $currentYear - 1)
            ->update(['status_alerta' => 1]);

        // Ano atual → verde
        DB::table('livros')
            ->whereNull('deleted_at')
            ->whereYear('updated_at', $currentYear)
            ->update(['status_alerta' => 0]);
    }

    public function down(): void
    {
        Schema::table('livros', function (Blueprint $table) {
            $table->dropColumn('status_alerta');
        });
    }
};
