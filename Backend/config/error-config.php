<?php
// config/error-config.php
// Mostrar errores en JSON en lugar de HTML

error_reporting(E_ALL);
ini_set('display_errors', 0);  // No mostrar en HTML
ini_set('log_errors', 1);      // Loguear errores

// Interceptar errores y convertir a JSON
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error PHP',
        'error' => $errstr,
        'file' => $errfile,
        'line' => $errline
    ]);
    exit();
});

// Interceptar excepciones
set_exception_handler(function($exception) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Excepción PHP',
        'error' => $exception->getMessage(),
        'file' => $exception->getFile(),
        'line' => $exception->getLine()
    ]);
    exit();
});
?>