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
        Schema::create('escolas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('concelho_id')->nullable();
            $table->string('nome');
            $table->string('codigo');
            $table->boolean('isAtivo');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('concelho_id')
                ->references('id')
                ->on('concelhos')
                ->onDelete('set null')
                ->onUpdate('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('escolas');
    }
};
