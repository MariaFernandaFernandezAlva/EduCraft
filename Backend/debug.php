<?php
// debug.php

require_once __DIR__ . '/config/response.php';
enableCORS();

session_start();

echo json_encode([
    'session_id' => session_id(),
    'session_status' => session_status() === PHP_SESSION_NONE ? 'NONE' : 'ACTIVE',
    'session_data' => $_SESSION,
    'cookies_received' => $_COOKIE,
    'http_origin' => $_SERVER['HTTP_ORIGIN'] ?? 'NO HEADER',
    'php_version' => phpversion()
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>