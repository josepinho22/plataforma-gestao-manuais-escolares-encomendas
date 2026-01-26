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
     * -- 1 = SOLICITADO
     * -- 2 = ENTREGA_PARCIAL
     * -- 3 = ENTREGA_COMPLETA
     */
    public function up(): void
    {
        Schema::create('encomendas_editora', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('editora_id');
            $table->enum('status', ['SOLICITADO', 'ENTREGA_PARCIAL', 'ENTREGA_COMPLETA']);
            $table->dateTime('data_solicitada')->nullable();
            $table->timestamp('updated_at');

            $table->foreign('editora_id')
                ->references('id')
                ->on('editoras')
                ->onDelete('no action')
                ->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('encomendas_editora');
    }
};
