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
        Schema::create('alunos', function (Blueprint $table) {
            $table->id();
            $table->string('nif');
            $table->string('id_mega')->nullable();
            $table->string('nome');
            $table->string('telefone')->nullable();
            $table->string('email')->nullable();
            $table->string('numero_cliente')->nullable();
            $table->timestamp('created_at')->nullable();;
            $table->timestamp('updated_at')->nullable();;
            $table->softDeletes();

            $table->unique('nif', 'alunos_index_0');
            $table->unique('id_mega', 'alunos_index_1');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alunos');
    }
};
