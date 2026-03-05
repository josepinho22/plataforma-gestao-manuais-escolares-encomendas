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
        Schema::create('alocacoes_stock', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('livro_id')->nullable();
            $table->unsignedBigInteger('rececao_editora_item_id')->nullable();
            $table->unsignedBigInteger('encomenda_aluno_item_id')->nullable();
            $table->integer('quantidade_alocada');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->softDeletes();

            $table->foreign('livro_id')
                ->references('id')
                ->on('livros')
                ->onDelete('set null')
                ->onUpdate('no action');

            $table->foreign('rececao_editora_item_id')
                ->references('id')
                ->on('rececao_livro_itens')
                ->onDelete('set null')
                ->onUpdate('no action');

            $table->foreign('encomenda_aluno_item_id')
                ->references('id')
                ->on('encomenda_livro_aluno_itens')
                ->onDelete('set null')
                ->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alocacoes_stock');
    }
};
