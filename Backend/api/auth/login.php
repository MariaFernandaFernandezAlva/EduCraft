<?php
// api/auth/login.php
// Endpoint para que el admin inicie sesión

// Habilitar CORS y cargar configuración
require_once __DIR__ . '/../../config/response.php';
enableCORS();

// Validar que sea una solicitud POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Método no permitido', 405);
}

// Obtener conexión a BD
$conn = require_once __DIR__ . '/../../config/database.php';

// Obtener datos del formulario
$email = getRequiredField('email');
$password = getRequiredField('password');

// Validar formato de email
if (!isValidEmail($email)) {
    sendError('El correo electrónico no es válido', 400);
}

// Buscar el admin en la BD
$query = "SELECT id, email, password_hash, full_name FROM admin_users WHERE email = ?";
$stmt = $conn->prepare($query);

if (!$stmt) {
    sendError('Error en la consulta a la BD', 500);
}

// Bind parameter (? se reemplaza con $email)
$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();

// Verificar si existe el admin
if ($result->num_rows === 0) {
    sendError('Email o contraseña incorrectos', 401);
}

// Obtener datos del admin
$admin = $result->fetch_assoc();

// Verificar la contraseña con password_verify()
if (!password_verify($password, $admin['password_hash'])) {
    sendError('Email o contraseña incorrectos', 401);
}

// ✅ Contraseña correcta - Crear sesión
$_SESSION['admin_id'] = $admin['id'];
$_SESSION['admin_email'] = $admin['email'];
$_SESSION['admin_name'] = $admin['full_name'];
$_SESSION['logged_in'] = true;

// Retornar respuesta exitosa
sendSuccess([
    'id' => $admin['id'],
    'email' => $admin['email'],
    'full_name' => $admin['full_name']
], 'Sesión iniciada exitosamente', 200);

$stmt->close();
$conn->close();
?>