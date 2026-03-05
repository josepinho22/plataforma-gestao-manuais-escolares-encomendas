<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Adiciona campo para relacionar manual com caderno de atividades
     * Quando um manual e caderno são criados juntos, ficam linkados por este campo
     */
    public function up(): void
    {
        Schema::table('livros', function (Blueprint $table) {
            $table->unsignedBigInteger('livro_relacionado_id')->nullable()->after('ano_escolar_id');

            $table->foreign('livro_relacionado_id')
                ->references('id')
                ->on('livros')
                ->onDelete('set null')
                ->onUpdate('no action');

            $table->index('livro_relacionado_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('livros', function (Blueprint $table) {
            $table->dropForeign(['livro_relacionado_id']);
            $table->dropIndex(['livro_relacionado_id']);
            $table->dropColumn('livro_relacionado_id');
        });
    }
};
