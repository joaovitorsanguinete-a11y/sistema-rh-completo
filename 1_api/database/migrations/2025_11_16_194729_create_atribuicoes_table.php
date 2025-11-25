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
        Schema::create('atribuicoes', function (Blueprint $table) {
            $table->id();

            // "Cola" com a tabela 'funcionarios'
            $table->foreignId('funcionario_id')
                  ->constrained('funcionarios')
                  ->onDelete('cascade'); // Se apagar o funcionário, apaga as atribuições

            // "Cola" com a tabela 'cargos'
            $table->foreignId('cargo_id')
                  ->constrained('cargos')
                  ->onDelete('restrict'); // NÃO deixa apagar um cargo se ele estiver em uso

            // Os campos específicos desta atribuição
            $table->string('tipo_vinculo'); // Ex: 'EFETIVO', 'CONTRATADO'
            $table->string('turno'); // Ex: 'Manhã', 'Tarde', 'Integral'
            $table->date('data_inicio_atribuicao');
            $table->boolean('principal')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('atribuicoes');
    }
};
