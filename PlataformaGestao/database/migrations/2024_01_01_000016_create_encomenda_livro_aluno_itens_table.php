<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Note: ensacado values:
     * -- 0 = nao ensacado
     * -- 1 = ensacado
     */
    public function up(): void
    {
        Schema::create('encomenda_livro_aluno_itens', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('encomenda_aluno_id');
            $table->unsignedBigInteger('livro_id');
            $table->tinyInteger('quantidade');
            $table->boolean('encapar')->default(false);
            $table->boolean('encapado')->default(false);
            $table->tinyInteger('quantidade_entregue');
            $table->boolean('entregue')->default(false);
            $table->boolean('ensacado')->default(false);
            $table->timestamp('updated_at');

            $table->foreign('encomenda_aluno_id')
                ->references('id')
                ->on('encomendas_aluno')
                ->onDelete('no action')
                ->onUpdate('no action');

            $table->foreign('livro_id')
                ->references('id')
                ->on('livros')
                ->onDelete('no action')
                ->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('encomenda_livro_aluno_itens');
    }
};
