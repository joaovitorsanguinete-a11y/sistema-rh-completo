<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cargo extends Model
{
    use HasFactory;

    /**
     * Os atributos que podem ser preenchidos em massa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'descricao',
    ];

    /**
     * Define a relação: Um Cargo PODE ESTAR EM MUITAS Atribuições.
     */
    public function atribuicoes(): HasMany
    {
        return $this->hasMany(Atribuicao::class);
    }
}
