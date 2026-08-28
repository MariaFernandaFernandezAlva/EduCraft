<?php
// api/auth/login.php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once dirname(dirname(dirname(__FILE__))) . '/config/response.php';
require_once dirname(dirname(dirname(__FILE__))) . '/config/database.php';
enableCORS();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Método no permitido', 405);
}

// Obtener datos
$email = getRequiredField('email');
$password = getRequiredField('password');

if (!isValidEmail($email)) {
    sendError('El correo no es válido', 400);
}

// Usar la conexión global $conn que ya fue creada en database.php
global $conn;

$query = "SELECT id, email, password_hash, full_name FROM admin_users WHERE email = ?";
$stmt = $conn->prepare($query);

if (!$stmt) {
    sendError('Error en la consulta: ' . $conn->error, 500);
}

$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    sendError('Email o contraseña incorrectos', 401);
}

$admin = $result->fetch_assoc();

if (!password_verify($password, $admin['password_hash'])) {
    sendError('Email o contraseña incorrectos', 401);
}

// ✅ Crear sesión
$_SESSION['admin_id'] = $admin['id'];
$_SESSION['admin_email'] = $admin['email'];
$_SESSION['admin_name'] = $admin['full_name'];
$_SESSION['logged_in'] = true;

sendSuccess([
    'id' => $admin['id'],
    'email' => $admin['email'],
    'full_name' => $admin['full_name']
], 'Sesión iniciada exitosamente', 200);

$stmt->close();