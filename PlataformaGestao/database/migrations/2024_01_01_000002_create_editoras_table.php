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
        Schema::create('editoras', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('codigo');
            $table->string('contacto_email')->nullable();
            $table->string('contacto_telefone')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('editoras');
    }
};
