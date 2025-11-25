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
        Schema::create('documentos', function (Blueprint $table) {
            $table->id();

            // Esta é a "cola" que liga o documento ao funcionário
            $table->foreignId('funcionario_id')
                  ->constrained('funcionarios') // constrained() diz que 'funcionario_id' se refere a 'id' em 'funcionarios'
                  ->onDelete('cascade'); // Se o funcionário for apagado, apaga os documentos dele

            $table->string('titulo'); // Um nome amigável (Ex: "Atestado COVID")

            // A categoria que você pediu (Ex: "Contrato", "Atestado Médico", "Certificado")
            $table->string('categoria');

            $table->string('caminho_arquivo'); // Onde o arquivo está salvo no servidor
            $table->string('nome_original')->nullable(); // O nome que o arquivo tinha no PC do usuário
            $table->string('tipo_mime')->nullable(); // Ex: "application/pdf" ou "image/jpeg"
            $table->unsignedBigInteger('tamanho')->nullable(); // O tamanho do arquivo em bytes

            $table->timestamps(); // O 'created_at' vai nos dizer a data do upload
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documentos');
    }
};
