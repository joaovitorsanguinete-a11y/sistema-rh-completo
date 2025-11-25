<?php
$host = '127.0.0.1';
$db   = 'sistema_rh_v2';
$user = 'root';
$pass = '';
$port = "3306";
$charset = 'utf8mb4';

$options = [
    \PDO::ATTR_ERRMODE            => \PDO::ERRMODE_EXCEPTION,
    \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
    \PDO::ATTR_EMULATE_PREPARES   => false,
];

$dsn = "mysql:host=$host;dbname=$db;charset=$charset;port=$port";

try {
     $pdo = new \PDO($dsn, $user, $pass, $options);
     echo "<h1>✅ SUCESSO!</h1>";
     echo "<p>O PHP conseguiu conectar no MySQL.</p>";
     echo "<p>Versão do Servidor: " . $pdo->getAttribute(PDO::ATTR_SERVER_VERSION) . "</p>";
} catch (\PDOException $e) {
     echo "<h1>❌ ERRO FATAL</h1>";
     echo "<p>O PHP NÃO conseguiu conectar.</p>";
     echo "<hr>";
     echo "<strong>Mensagem:</strong> " . $e->getMessage() . "<br>";
     echo "<strong>Código:</strong> " . $e->getCode();
}
?>
