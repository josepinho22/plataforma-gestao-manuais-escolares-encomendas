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
        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('livro_id')->nullable();
            $table->bigInteger('quantidade');
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->softDeletes();

            $table->unique('livro_id', 'stocks_index_0');

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
        Schema::dropIfExists('stocks');
    }
};
