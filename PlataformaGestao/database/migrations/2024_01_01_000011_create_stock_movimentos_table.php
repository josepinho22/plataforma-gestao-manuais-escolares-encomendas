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
        Schema::create('stock_movimentos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('livro_id')->nullable();
            $table->tinyInteger('tipo');
            $table->integer('quantidade');
            $table->string('observacao')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->softDeletes();

            $table->foreign('livro_id')
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
        Schema::dropIfExists('stock_movimentos');
    }
};
