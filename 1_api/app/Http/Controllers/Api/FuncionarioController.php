<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Funcionario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Throwable;

class FuncionarioController extends Controller
{
    /**
     * Lista todos os funcionários com sua atribuição principal.
     */
    public function index()
    {
        $funcionarios = Funcionario::with([
            'atribuicoes' => function ($query) {
                $query->where('principal', true)
                      ->with('cargo');
            }
        ])
        ->orderBy('nome')
        ->get();

        return response()->json($funcionarios);
    }

    /**
     * Salva um NOVO funcionário E sua primeira atribuição.
     */
    public function store(Request $request)
    {
        // 1. Validação dos dados
        $request->validate([
            'nome' => 'required|string|max:255',
            'cpf' => 'required|string|size:11|unique:funcionarios',
            'matricula' => 'nullable|string|max:255|unique:funcionarios',
            'data_nascimento' => 'required|date',
            'data_admissao' => 'required|date',
            'observacoes' => 'nullable|string',
            'ativo' => 'boolean',

            // Dados da Atribuição Inicial
            'cargo_id' => 'required|integer|exists:cargos,id',
            'tipo_vinculo' => 'required|string',
            'turno' => 'required|string',
            'data_inicio_atribuicao' => 'required|date',
        ]);

        DB::beginTransaction();

        try {
            // 2. Cria o funcionário
            $funcionario = Funcionario::create([
                'nome' => $request->nome,
                'cpf' => $request->cpf,

                // --- CORREÇÃO CRÍTICA AQUI ---
                // Se 'matricula' vier preenchida, usa ela. Se vier vazia, salva NULL.
                'matricula' => $request->filled('matricula') ? $request->matricula : null,

                'data_nascimento' => $request->data_nascimento,
                'data_admissao' => $request->data_admissao,
                'observacoes' => $request->observacoes,
                'ativo' => $request->input('ativo', true),
            ]);

            // 3. Cria a atribuição vinculada
            $funcionario->atribuicoes()->create([
                'cargo_id' => $request->cargo_id,
                'tipo_vinculo' => $request->tipo_vinculo,
                'turno' => $request->turno,
                'data_inicio_atribuicao' => $request->data_inicio_atribuicao,
                'principal' => true,
            ]);

            DB::commit();

            // Recarrega para devolver a resposta completa
            $funcionario->load('atribuicoes.cargo');

            return response()->json($funcionario, 201);

        } catch (Throwable $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Erro ao cadastrar funcionário.',
                'error' => $e->getMessage() // Útil para debug no Console do navegador
            ], 500);
        }
    }

    /**
     * Mostra um único funcionário com TODOS os seus dados.
     */
    public function show(string $id)
    {
        $funcionario = Funcionario::with([
            'atribuicoes.cargo',
            'documentos'
        ])
        ->findOrFail($id);

        return response()->json($funcionario);
    }

    /**
     * Atualiza SOMENTE os dados pessoais do funcionário.
     */
    public function update(Request $request, string $id)
    {
        $funcionario = Funcionario::findOrFail($id);

        $request->validate([
            'nome' => 'required|string|max:255',
            'cpf' => ['required', 'string', 'size:11', Rule::unique('funcionarios')->ignore($funcionario->id)],
            'matricula' => ['nullable', 'string', 'max:255', Rule::unique('funcionarios')->ignore($funcionario->id)],
            'data_nascimento' => 'required|date',
            'data_admissao' => 'required|date',
            'observacoes' => 'nullable|string',
            'ativo' => 'boolean',
        ]);

        // Prepara os dados para atualização, garantindo que matrícula vazia vire NULL também na edição
        $dadosAtualizados = $request->all();
        if (!$request->filled('matricula')) {
            $dadosAtualizados['matricula'] = null;
        }

        $funcionario->update($dadosAtualizados);

        return response()->json($funcionario);
    }

    /**
     * Exclui um funcionário.
     */
    public function destroy(string $id)
    {
        $funcionario = Funcionario::findOrFail($id);
        $funcionario->delete();

        return response()->json(null, 204);
    }
}
