<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cargo; // 1. Importamos o Model
use Illuminate\Http\Request;
use Illuminate\Validation\Rule; // Para regras de validação
use Illuminate\Database\QueryException; // Para tratar erros do banco

class CargoController extends Controller
{
    /**
     * Lista todos os cargos.
     */
    public function index()
    {
        // 2. Busca todos os cargos no banco, ordenados por 'descricao'
        $cargos = Cargo::orderBy('descricao')->get();
        return response()->json($cargos);
    }

    /**
     * Salva um novo cargo no banco.
     */
    public function store(Request $request)
    {
        // 3. Valida os dados (não pode ser vazio e não pode repetir)
        $request->validate([
            'descricao' => 'required|string|max:255|unique:cargos',
        ]);

        // 4. Cria o novo cargo usando os dados validados
        $cargo = Cargo::create([
            'descricao' => $request->descricao,
        ]);

        // 5. Devolve o cargo que acabou de ser criado e o status "201 Created"
        return response()->json($cargo, 201);
    }

    /**
     * Mostra um único cargo pelo seu ID.
     */
    public function show(string $id)
    {
        // 6. Encontra o cargo pelo ID. Se não achar, falha (erro 404)
        $cargo = Cargo::findOrFail($id);
        return response()->json($cargo);
    }

    /**
     * Atualiza um cargo existente.
     */
    public function update(Request $request, string $id)
    {
        // 7. Encontra o cargo que queremos editar
        $cargo = Cargo::findOrFail($id);

        // 8. Valida os dados (tem que ser único, ignorando o ID dele mesmo)
        $request->validate([
            'descricao' => [
                'required',
                'string',
                'max:255',
                Rule::unique('cargos')->ignore($cargo->id),
            ],
        ]);

        // 9. Atualiza o cargo com a nova 'descricao'
        $cargo->update([
            'descricao' => $request->descricao,
        ]);

        // 10. Devolve o cargo atualizado
        return response()->json($cargo);
    }

    /**
     * Exclui um cargo.
     */
    public function destroy(string $id)
    {
        // 11. Encontra o cargo
        $cargo = Cargo::findOrFail($id);

        try {
            // 12. Tenta deletar
            $cargo->delete();

            // 13. Se conseguiu, devolve uma resposta vazia com status "204 No Content"
            return response()->json(null, 204);

        } catch (QueryException $e) {
            // 14. SE CAIR AQUI, é porque a regra 'onDelete('restrict')' foi ativada
            // (O cargo está em uso por uma atribuição e não pode ser apagado)
            return response()->json([
                'message' => 'Erro: Este cargo não pode ser excluído pois está em uso por uma ou mais atribuições.'
            ], 409); // Status "409 Conflict"
        }
    }
}
