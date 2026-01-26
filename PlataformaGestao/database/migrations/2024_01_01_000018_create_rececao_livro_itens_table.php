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
        Schema::create('rececao_livro_itens', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('rececao_editora_id');
            $table->unsignedBigInteger('encomenda_editora_item_id');
            $table->unsignedBigInteger('livro_id');
            $table->bigInteger('qtd_recebida');

            $table->foreign('rececao_editora_id')
                ->references('id')
                ->on('rececoes_editora')
                ->onDelete('no action')
                ->onUpdate('no action');

            $table->foreign('encomenda_editora_item_id')
                ->references('id')
                ->on('encomenda_livro_editora_itens')
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
        Schema::dropIfExists('rececao_livro_itens');
    }
};
