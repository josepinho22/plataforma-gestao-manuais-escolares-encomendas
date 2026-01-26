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
            $table->unsignedBigInteger('livro_id');
            $table->tinyInteger('tipo');
            $table->integer('quantidade');
            $table->string('observacao')->nullable();
            $table->timestamp('created_at');
            $table->timestamp('updated_at');

            // Note: No foreign key defined in original schema for livro_id
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
