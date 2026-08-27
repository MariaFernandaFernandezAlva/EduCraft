<?php
// api/auth/logout.php
// Endpoint para cerrar sesión

require_once __DIR__ . '/../../config/response.php';
enableCORS();

// Destruir sesión
session_destroy();

// Retornar respuesta
sendSuccess([], 'Sesión cerrada exitosamente', 200);
?>