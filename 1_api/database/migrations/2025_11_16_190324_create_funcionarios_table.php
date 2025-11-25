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
        Schema::create('funcionarios', function (Blueprint $table) {
            $table->id(); // Cria uma coluna 'id' auto-incremento (Chave Primária)

            $table->string('matricula')->nullable()->unique(); // ->nullable() = pode ser nulo
            $table->string('nome');
            $table->string('cpf', 11)->unique(); // ->unique() = não pode ter CPF repetido
            $table->date('data_nascimento');
            $table->date('data_admissao');
            $table->boolean('ativo')->default(true); // ->default(true) = começa como 'ativo'
            $table->text('observacoes')->nullable(); // text() = campo longo, para muitas notas

            $table->timestamps(); // Cria as colunas 'created_at' e 'updated_at'
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('funcionarios');
    }
};
