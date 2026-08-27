<?php
// api/auth/verify.php

require_once dirname(dirname(dirname(__FILE__))) . '/config/response.php';
enableCORS();

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (empty($_SESSION) || !isset($_SESSION['admin_id'])) {
    sendError('No autorizado - No hay sesión activa', 401);
}

if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    sendError('No autorizado - Sesión inválida', 401);
}

sendSuccess([
    'id' => $_SESSION['admin_id'],
    'email' => $_SESSION['admin_email'] ?? '',
    'full_name' => $_SESSION['admin_name'] ?? ''
], 'Sesión activa', 200);
?>