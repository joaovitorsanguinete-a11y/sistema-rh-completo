<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Cargo;

// 1. Importa TODOS os nossos "cérebros" (Controllers)
use App\Http\Controllers\Api\FuncionarioController;
use App\Http\Controllers\Api\CargoController;
use App\Http\Controllers\Api\AtribuicaoController;
use App\Http\Controllers\Api\DocumentoController;
use App\Http\Controllers\Api\UsuarioController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\AuthController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Aqui é onde você pode registrar as rotas de API para sua aplicação.
|
*/

// Rota de teste (pode apagar depois)
Route::get('/teste', function () {
    return response()->json(['message' => 'API conectada com sucesso!']);
});
Route::get('/criar-cargo-teste', function () {
    try {
        $cargo = Cargo::create(['descricao' => 'Professor(a)']);
        return response()->json($cargo);
    } catch (Exception $e) {
        return response()->json(['message' => 'Cargo já existe ou erro.', 'error' => $e->getMessage()], 400);
    }
});
// TODO: Rotas de Autenticação (Login/Logout)
// (Vamos adicionar a rota de login aqui mais tarde)


// --- ROTAS PROTEGIDAS ---
// TODO: Adicionar 'middleware' => 'auth:sanctum' quando o login estiver pronto
// Por enquanto, deixaremos abertas para testar.

// 2. Cria um "grupo" de rotas para /funcionarios
// Isso nos dá URLs como: /api/funcionarios
Route::apiResource('funcionarios', FuncionarioController::class);

// 3. Cria um "grupo" de rotas para /cargos
// Isso nos dá URLs como: /api/cargos
Route::apiResource('cargos', CargoController::class);

// 4. Cria um "grupo" de rotas para /atribuicoes
// Isso nos dá URLs como: /api/atribuicoes
Route::apiResource('atribuicoes', AtribuicaoController::class);

// 5. Cria um "grupo" de rotas para /documentos
// (Nota: o 'update' não foi implementado, mas a rota existirá)
Route::apiResource('documentos', DocumentoController::class);

// 6. Cria um "grupo" de rotas para /usuarios
// Isso nos dá URLs como: /api/usuarios
Route::apiResource('usuarios', UsuarioController::class);

Route::get('/debug-salvar', function () {
    try {
        // 1. Tenta criar um funcionário FAKE (para testar o banco)
        $func = \App\Models\Funcionario::create([
            'nome' => 'Teste Debug ' . rand(1,999),
            'cpf' => '111222333' . rand(10,99), // CPF aleatório para não repetir
            'matricula' => null,
            'data_nascimento' => '2000-01-01',
            'data_admissao' => '2024-01-01',
            'ativo' => true
        ]);

        // 2. Tenta criar a atribuição (AQUI É ONDE DEVE ESTAR O ERRO)
        // Vamos pegar o PRIMEIRO cargo que existir no banco
        $cargo = \App\Models\Cargo::first();

        if (!$cargo) {
            return "❌ ERRO: Você não tem nenhum cargo cadastrado no banco! Cadastre um cargo antes.";
        }

        $func->atribuicoes()->create([
            'cargo_id' => $cargo->id,
            'tipo_vinculo' => 'EFETIVO',
            'turno' => 'Manhã',
            'data_inicio_atribuicao' => '2024-01-01',
            'principal' => true
        ]);

        return "✅ SUCESSO! O sistema está funcionando. O problema é no formulário React.";

    } catch (\Throwable $e) {
        // Imprime o erro exato na tela
        return "❌ ERRO DESCOBERTO: " . $e->getMessage();
    }
});

Route::get('/dashboard-stats', [DashboardController::class, 'index']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/criar-admin', function () {
    try {
        $user = \App\Models\Usuario::create([
            'nome' => 'Administrador',
            'email' => 'admin@escola.com',
            'password' => '12345678', // A senha será criptografada automaticamente
            'permissao' => 'admin'
        ]);
        return $user;
    } catch (\Exception $e) {
        return "Erro (talvez já exista): " . $e->getMessage();
    }
});

Route::get('/debug-login', function () {
    $email = 'admin@escola.com';
    $senha = '12345678';

    // 1. Testa se o usuário existe
    $user = \App\Models\Usuario::where('email', $email)->first();

    if (!$user) {
        return response()->json(['erro' => '❌ Usuário não encontrado no banco de dados.']);
    }

    // 2. Testa se a senha bate manualmente
    if (!\Illuminate\Support\Facades\Hash::check($senha, $user->password)) {
        return response()->json(['erro' => '❌ A senha está errada! O hash no banco não corresponde a 12345678.']);
    }

    // 3. Testa se o sistema de Auth do Laravel funciona
    if (!\Illuminate\Support\Facades\Auth::attempt(['email' => $email, 'password' => $senha])) {
        return response()->json(['erro' => '❌ Auth::attempt falhou. O Laravel está procurando na tabela errada (provavelmente "users" em vez de "usuarios"). Verifique config/auth.php.']);
    }

    return response()->json(['sucesso' => '✅ SUCESSO! O Login está funcionando tecnicamente. O problema pode estar no Frontend.']);
});
