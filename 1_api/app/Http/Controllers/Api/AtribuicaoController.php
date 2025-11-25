<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Atribuicao; // 1. Importa o Model
use App\Models\Funcionario; // 2. Importa o Funcionario (precisamos dele)
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // Para transações

class AtribuicaoController extends Controller
{
    /**
     * Lista todas as atribuições de UM funcionário específico.
     * (Não usaremos 'index' para listar todas do sistema, não é útil)
     */
    public function index(Request $request)
    {
        // Esta rota vai exigir um ?funcionario_id=X na URL
        $request->validate(['funcionario_id' => 'required|integer|exists:funcionarios,id']);

        $atribuicoes = Atribuicao::where('funcionario_id', $request->funcionario_id)
            ->with('cargo') // Puxa o nome do cargo junto
            ->orderBy('principal', 'desc')
            ->orderBy('data_inicio_atribuicao', 'desc')
            ->get();

        return response()->json($atribuicoes);
    }

    /**
     * Adiciona uma NOVA atribuição a um funcionário existente.
     */
    public function store(Request $request)
    {
        // 3. Valida os dados (Note a validação do funcionario_id)
        $request->validate([
            'funcionario_id' => 'required|integer|exists:funcionarios,id',
            'cargo_id' => 'required|integer|exists:cargos,id',
            'tipo_vinculo' => 'required|string',
            'turno' => 'required|string',
            'data_inicio_atribuicao' => 'required|date',
            'principal' => 'boolean',
        ]);

        $funcionario = Funcionario::findOrFail($request->funcionario_id);

        DB::beginTransaction();
        try {
            // 4. Se a nova for 'principal', remove o 'principal' das outras
            if ($request->input('principal', false)) {
                $funcionario->atribuicoes()->update(['principal' => false]);
            }

            // 5. Cria a nova atribuição
            $atribuicao = $funcionario->atribuicoes()->create($request->all());

            DB::commit();

            $atribuicao->load('cargo'); // Carrega o nome do cargo
            return response()->json($atribuicao, 201);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao adicionar nova atribuição.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostra uma única atribuição (para edição, por exemplo).
     */
    public function show(string $id)
    {
        // 6. Encontra a atribuição e o nome do cargo dela
        $atribuicao = Atribuicao::with('cargo')->findOrFail($id);
        return response()->json($atribuicao);
    }

    /**
     * Atualiza uma atribuição existente.
     */
    public function update(Request $request, string $id)
    {
        // 7. Encontra a atribuição
        $atribuicao = Atribuicao::findOrFail($id);

        // 8. Valida os dados
        $request->validate([
            'cargo_id' => 'required|integer|exists:cargos,id',
            'tipo_vinculo' => 'required|string',
            'turno' => 'required|string',
            'data_inicio_atribuicao' => 'required|date',
            'principal' => 'boolean',
        ]);

        DB::beginTransaction();
        try {
            // 9. Se esta está sendo marcada como 'principal'...
            if ($request->input('principal', false)) {
                // ...tira o 'principal' de todas as outras do mesmo funcionário
                Atribuicao::where('funcionario_id', $atribuicao->funcionario_id)
                           ->where('id', '!=', $atribuicao->id) // exceto ela mesma
                           ->update(['principal' => false]);
            }

            // 10. Atualiza a atribuição
            $atribuicao->update($request->all());

            DB::commit();

            $atribuicao->load('cargo'); // Recarrega com o nome do cargo
            return response()->json($atribuicao);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao atualizar atribuição.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exclui uma atribuição.
     */
    public function destroy(string $id)
    {
        // 11. Encontra a atribuição
        $atribuicao = Atribuicao::findOrFail($id);

        // 12. Regra de Segurança: Não pode excluir a *única* atribuição
        $totalAtribuicoes = Atribuicao::where('funcionario_id', $atribuicao->funcionario_id)->count();
        if ($totalAtribuicoes <= 1) {
            return response()->json([
                'message' => 'Não é possível excluir a única atribuição do funcionário.'
            ], 400); // 400 Bad Request
        }

        $eraPrincipal = $atribuicao->principal;

        // 13. Deleta
        $atribuicao->delete();

        // 14. Se a excluída era a principal, promove outra
        if ($eraPrincipal) {
            $outraAtribuicao = Atribuicao::where('funcionario_id', $atribuicao->funcionario_id)
                                        ->orderBy('data_inicio_atribuicao', 'desc')
                                        ->first(); // Pega a mais recente
            if ($outraAtribuicao) {
                $outraAtribuicao->update(['principal' => true]);
            }
        }

        return response()->json(null, 204);
    }
}
