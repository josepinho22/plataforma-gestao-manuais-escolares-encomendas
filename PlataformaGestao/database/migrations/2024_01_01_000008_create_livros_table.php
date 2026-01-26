<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Note: tipo livro:
     * -- 1 = Manual
     * -- 2 = Caderno atividades
     */
    public function up(): void
    {
        Schema::create('livros', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('editora_id');
            $table->unsignedBigInteger('disciplina_id');
            $table->unsignedBigInteger('ano_escolar_id');
            $table->enum('tipo', ['MANUAL', 'CADERNO_ATIVIDADES']);
            $table->string('titulo');
            $table->string('isbn')->nullable();
            $table->decimal('preco');
            $table->boolean('ativo')->default(true);
            $table->timestamp('created_at');
            $table->timestamp('updated_at');

            // Note: Original schema has index on 'papelaria_id' which doesn't exist as a column.
            // Implementing only valid indexes:
            $table->index('disciplina_id', 'livros_index_1');
            $table->index('editora_id', 'livros_index_2');
            $table->index('ano_escolar_id', 'livros_index_3'); // Original: 'ano_escolar'

            $table->foreign('editora_id')
                ->references('id')
                ->on('editoras')
                ->onDelete('no action')
                ->onUpdate('no action');

            $table->foreign('disciplina_id')
                ->references('id')
                ->on('disciplinas')
                ->onDelete('no action')
                ->onUpdate('no action');

            $table->foreign('ano_escolar_id')
                ->references('id')
                ->on('anos_escolares')
                ->onDelete('no action')
                ->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('livros');
    }
};
