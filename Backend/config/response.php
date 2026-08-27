<?php
// config/response.php
// Este archivo tiene funciones reutilizables para respuestas JSON

/**
 * Enviar respuesta JSON de éxito
 * 
 * @param array $data - Los datos a retornar
 * @param string $message - Mensaje opcional
 * @param int $statusCode - Código HTTP (200 por defecto)
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
 * 
 * @param string $message - Mensaje de error
 * @param int $statusCode - Código HTTP (400 por defecto)
 * @param array $errors - Errores detallados (opcional)
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
 * 
 * @param string $fieldName - Nombre del campo
 * @return mixed - El valor del campo o null
 */
function getRequiredField($fieldName) {
    if (!isset($_POST[$fieldName]) || empty(trim($_POST[$fieldName]))) {
        sendError("El campo '$fieldName' es requerido", 400);
    }
    return trim($_POST[$fieldName]);
}

/**
 * Validar email
 * 
 * @param string $email - Email a validar
 * @return bool
 */
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Habilitar CORS para que React pueda comunicarse
 */
function enableCORS() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Content-Type: application/json; charset=utf-8');
    
    // Si es una solicitud OPTIONS, terminar aquí
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}
?>