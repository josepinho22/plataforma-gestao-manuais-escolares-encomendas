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
        Schema::create('rececoes_editora', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('encomenda_editora_id')->nullable();
            $table->dateTime('data_rececao');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('encomenda_editora_id')
                ->references('id')
                ->on('encomendas_editora')
                ->onDelete('set null')
                ->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rececoes_editora');
    }
};
