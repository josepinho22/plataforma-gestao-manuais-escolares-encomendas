<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('anos_letivos', function (Blueprint $table) {
            $table->id();
            $table->string('nome'); // ex: 2025/2026
            $table->date('data_inicio');
            $table->date('data_fim');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('anos_letivos');
    }
};
