<?php
// config/response.php
// Este archivo tiene funciones reutilizables para respuestas JSON

/**
 * Enviar respuesta JSON de éxito
 */
function sendSuccess($data = [], $message = 'Operación exitosa', $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode([
        'success' => true,
        'message' => $message,
        'data' => $data
    ]);
    exit();
}

/**
 * Enviar respuesta JSON de error
 */
function sendError($message = 'Error en la operación', $statusCode = 400, $errors = []) {
    http_response_code($statusCode);
    echo json_encode([
        'success' => false,
        'message' => $message,
        'errors' => $errors
    ]);
    exit();
}

/**
 * Validar que exista un campo requerido
 */
function getRequiredField($fieldName) {
    if (!isset($_POST[$fieldName]) || empty(trim($_POST[$fieldName]))) {
        sendError("El campo '$fieldName' es requerido", 400);
    }
    return trim($_POST[$fieldName]);
}

/**
 * Validar email
 */
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Habilitar CORS para que React pueda comunicarse
 */
function enableCORS() {
    // Permitir solo el frontend de Vite
    $allowed_origin = 'http://localhost:5173';
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    if ($origin === $allowed_origin) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Credentials: true');
    }
    
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Content-Type: application/json; charset=utf-8');
    
    // Manejar preflight OPTIONS
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}
