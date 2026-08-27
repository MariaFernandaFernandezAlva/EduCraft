<?php
// config/database.php
// Este archivo gestiona la conexión a la base de datos

// Credenciales de la BD
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'educraft');

// Crear conexión
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Verificar conexión
if ($conn->connect_error) {
    // Si hay error, retornamos JSON
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error de conexión a la base de datos: ' . $conn->connect_error
    ]);
    exit();
}

// Configurar charset para evitar problemas con ñ y acentos
$conn->set_charset("utf8mb4");

// Permitir cookies para sesiones
session_start();

// Retornar la conexión
return $conn;
?>