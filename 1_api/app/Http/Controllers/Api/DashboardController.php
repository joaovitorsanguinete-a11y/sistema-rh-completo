<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Funcionario;
use App\Models\Cargo;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        // Conta os registros no banco
        $totalFuncionarios = Funcionario::count();
        $ativos = Funcionario::where('ativo', true)->count();
        $inativos = Funcionario::where('ativo', false)->count();
        $totalCargos = Cargo::count();

        // Pega os 5 últimos funcionários cadastrados
        $recentes = Funcionario::with('atribuicoes.cargo')
                        ->orderBy('created_at', 'desc')
                        ->take(5)
                        ->get();

        return response()->json([
            'total_funcionarios' => $totalFuncionarios,
            'ativos' => $ativos,
            'inativos' => $inativos,
            'total_cargos' => $totalCargos,
            'recentes' => $recentes
        ]);
    }
}
