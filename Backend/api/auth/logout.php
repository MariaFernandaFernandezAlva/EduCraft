<?php
// api/auth/logout.php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once dirname(dirname(dirname(__FILE__))) . '/config/response.php';
enableCORS();

session_destroy();

sendSuccess([], 'Sesión cerrada exitosamente', 200);
?>