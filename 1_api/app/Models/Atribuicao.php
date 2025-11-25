<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Atribuicao extends Model
{
    use HasFactory;

    // --- A CORREÇÃO ESTÁ AQUI ---
    // Dizemos ao Laravel: "Pare de procurar 'atribuicaos', o nome é 'atribuicoes'!"
    protected $table = 'atribuicoes';

    protected $fillable = [
        'funcionario_id',
        'cargo_id',
        'tipo_vinculo',
        'turno',
        'data_inicio_atribuicao',
        'principal',
    ];

    public function funcionario(): BelongsTo
    {
        return $this->belongsTo(Funcionario::class);
    }

    public function cargo(): BelongsTo
    {
        return $this->belongsTo(Cargo::class);
    }
}
