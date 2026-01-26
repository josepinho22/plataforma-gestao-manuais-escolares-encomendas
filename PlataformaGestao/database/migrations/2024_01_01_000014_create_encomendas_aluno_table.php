<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Note: status values:
     * -- 1 = AGUARDA_LIVROS
     * -- 2 = AGUARDA_ENSACAMENTO
     * -- 3 = AGUARDA_ENCAPAMENTO
     * -- 4 = AGUARDA_LEVANTAMENTO
     * -- 5 = ENTREGUE
     */
    public function up(): void
    {
        Schema::create('encomendas_aluno', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('aluno_id');
            $table->string('nif');
            $table->string('id_mega')->nullable();
            $table->string('nome');
            $table->string('telefone')->nullable();
            $table->unsignedBigInteger('escola_id');
            $table->unsignedBigInteger('ano_letivo_id');
            $table->unsignedBigInteger('ano_escolar_id');
            $table->unsignedBigInteger('lista_id');
            $table->enum('status', ['AGUARDA_LIVROS', 'AGUARDA_ENSACAMENTO','AGUARDA_ENCAPAMENTO', 'AGUARDA_LEVANTAMENTO', 'ENTREGUE']);
            $table->string('observacao')->nullable();
            $table->timestamp('created_at');
            $table->timestamp('updated_at');

            $table->foreign('aluno_id')
                ->references('id')
                ->on('alunos')
                ->onDelete('no action')
                ->onUpdate('no action');

            $table->foreign('escola_id')
                ->references('id')
                ->on('escolas')
                ->onDelete('no action')
                ->onUpdate('no action');

            $table->foreign('ano_letivo_id')
                ->references('id')
                ->on('anos_letivos')
                ->onDelete('no action')
                ->onUpdate('no action');

            $table->foreign('lista_id')
                ->references('id')
                ->on('listas_livros')
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
        Schema::dropIfExists('encomendas_aluno');
    }
};
