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
        Schema::create('lista_livro_itens', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('lista_id')->nullable();
            $table->unsignedBigInteger('disciplina_id')->nullable();
            $table->unsignedBigInteger('manual_livro_id')->nullable();
            $table->unsignedBigInteger('caderno_livro_id')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->softDeletes();

            $table->foreign('lista_id')
                ->references('id')
                ->on('listas_livros')
                ->onDelete('set null')
                ->onUpdate('no action');

            $table->foreign('disciplina_id')
                ->references('id')
                ->on('disciplinas')
                ->onDelete('set null')
                ->onUpdate('no action');

            $table->foreign('manual_livro_id')
                ->references('id')
                ->on('livros')
                ->onDelete('set null')
                ->onUpdate('no action');

            $table->foreign('caderno_livro_id')
                ->references('id')
                ->on('livros')
                ->onDelete('set null')
                ->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lista_livro_itens');
    }
};
