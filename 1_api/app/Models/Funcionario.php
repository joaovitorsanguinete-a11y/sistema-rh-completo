<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany; // Importante para as relações

class Funcionario extends Model
{
    use HasFactory;

    /**
     * Os atributos que podem ser preenchidos em massa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'matricula',
        'nome',
        'cpf',
        'data_nascimento',
        'data_admissao',
        'ativo',
        'observacoes',
    ];

    /**
     * Define a relação: Um Funcionário TEM MUITAS Atribuições.
     */
    public function atribuicoes(): HasMany
    {
        return $this->hasMany(Atribuicao::class);
    }

    /**
     * Define a relação: Um Funcionário TEM MUITOS Documentos.
     */
    public function documentos(): HasMany
    {
        return $this->hasMany(Documento::class);
    }
}
