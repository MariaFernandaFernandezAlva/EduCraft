<?php
// api/auth/verify.php
// Endpoint para verificar si el admin está logueado

require_once __DIR__ . '/../../config/response.php';
enableCORS();

// Verificar si hay sesión activa
if (!isset($_SESSION['admin_id']) || !$_SESSION['logged_in']) {
    sendError('No autorizado - Debes iniciar sesión', 401);
}

// Sesión válida - Retornar datos del admin
sendSuccess([
    'id' => $_SESSION['admin_id'],
    'email' => $_SESSION['admin_email'],
    'full_name' => $_SESSION['admin_name']
], 'Sesión activa', 200);
?>