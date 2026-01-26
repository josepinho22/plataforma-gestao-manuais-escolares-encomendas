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
        Schema::create('encomenda_livro_editora_itens', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('encomenda_editora_id');
            $table->unsignedBigInteger('livro_id');
            $table->bigInteger('qtd_solicitada');
            $table->bigInteger('qtd_recebida_total');

            $table->foreign('encomenda_editora_id')
                ->references('id')
                ->on('encomendas_editora')
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
        Schema::dropIfExists('encomenda_livro_editora_itens');
    }
};
