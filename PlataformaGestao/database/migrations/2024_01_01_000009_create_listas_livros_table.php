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
        Schema::create('listas_livros', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('escola_id')->nullable();
            $table->unsignedBigInteger('ano_letivo_id')->nullable();
            $table->unsignedBigInteger('ano_escolar_id')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->softDeletes();

            // Note: Original index includes 'papelaria_id' which doesn't exist.
            // Implementing with existing columns only:
            $table->unique(['escola_id', 'ano_letivo_id', 'ano_escolar_id'], 'listas_livros_index_0');

            $table->foreign('escola_id')
                ->references('id')
                ->on('escolas')
                ->onDelete('set null')
                ->onUpdate('no action');

            $table->foreign('ano_letivo_id')
                ->references('id')
                ->on('anos_letivos')
                ->onDelete('set null')
                ->onUpdate('no action');

            $table->foreign('ano_escolar_id')
                ->references('id')
                ->on('anos_escolares')
                ->onDelete('set null')
                ->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listas_livros');
    }
};
