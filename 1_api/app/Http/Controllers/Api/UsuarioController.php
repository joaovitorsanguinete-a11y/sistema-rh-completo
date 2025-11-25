<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario; // 1. Importamos o Model
use Illuminate\Http\Request;
use Illuminate\Validation\Rule; // Para validação
use Illuminate\Validation\Rules\Password; // Para regras de senha forte


class UsuarioController extends Controller
{
    /**
     * Lista todos os usuários.
     */
    public function index()
    {
        // 2. Busca todos os usuários, ordenados por nome
        // O Model já esconde a senha (campo 'hidden' que definimos)
        $usuarios = Usuario::orderBy('nome')->get();
        return response()->json($usuarios);
    }

    /**
     * Salva um novo usuário no banco.
     */
    public function store(Request $request)
    {
        // 3. Valida os dados de entrada
        $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:usuarios',
            'permissao' => 'required|string|in:admin,usuario', // Só aceita 'admin' ou 'usuario'
            'password' => [
                'required',
                'string',
                Password::min(8)->mixedCase()->numbers(), // Exige senha forte
                'confirmed' // Procura por um campo 'password_confirmation'
            ],
        ]);

        // 4. Cria o usuário
        $usuario = Usuario::create([
            'nome' => $request->nome,
            'email' => $request->email,
            'permissao' => $request->permissao,
            'password' => $request->password,
            // Não precisamos criptografar! O Model (Usuario.php)
            // faz isso automaticamente por causa do '$casts = ['password' => 'hashed']'
        ]);

        // 5. Retorna o usuário criado (sem a senha)
        return response()->json($usuario, 201);
    }

    /**
     * Mostra um único usuário pelo seu ID.
     */
    public function show(string $id)
    {
        // 6. Encontra o usuário (sem a senha)
        $usuario = Usuario::findOrFail($id);
        return response()->json($usuario);
    }

    /**
     * Atualiza um usuário existente.
     */
    public function update(Request $request, string $id)
    {
        // 7. Encontra o usuário
        $usuario = Usuario::findOrFail($id);

        // 8. Valida os dados
        $request->validate([
            'nome' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('usuarios')->ignore($usuario->id), // Valida email único, ignorando o atual
            ],
            'permissao' => 'required|string|in:admin,usuario',
            'password' => [
                'nullable', // Senha é OPCIONAL na atualização
                'string',
                Password::min(8)->mixedCase()->numbers(),
                'confirmed',
            ],
        ]);

        // 9. Atualiza os dados básicos
        $usuario->nome = $request->nome;
        $usuario->email = $request->email;
        $usuario->permissao = $request->permissao;

        // 10. Atualiza a senha APENAS SE uma nova foi enviada
        if ($request->filled('password')) {
            $usuario->password = $request->password; // O Model criptografa automaticamente
        }

        // 11. Salva as alterações no banco
        $usuario->save();

        // 12. Retorna o usuário atualizado
        return response()->json($usuario);
    }

    /**
     * Exclui um usuário.
     */
    public function destroy(string $id)
    {
        // 13. Encontra o usuário
        $usuario = Usuario::findOrFail($id);

        // TODO: Adicionar lógica para não permitir que o usuário apague a si mesmo
        // if (auth()->id() == $id) {
        //     return response()->json(['message' => 'Você não pode excluir sua própria conta.'], 403);
        // }

        // 14. Deleta o usuário
        $usuario->delete();

        // 15. Retorna resposta de sucesso
        return response()->json(null, 204);
    }
}
