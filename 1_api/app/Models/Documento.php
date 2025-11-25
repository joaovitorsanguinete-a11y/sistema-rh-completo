<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Documento extends Model
{
    use HasFactory;

    /**
     * Os atributos que podem ser preenchidos em massa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'funcionario_id',
        'titulo',
        'categoria',
        'caminho_arquivo',
        'nome_original',
        'tipo_mime',
        'tamanho',
    ];

    /**
     * Define a relação: Este Documento PERTENCE A UM Funcionário.
     */
    public function funcionario(): BelongsTo
    {
        return $this->belongsTo(Funcionario::class);
    }
}
