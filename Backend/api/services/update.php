<?php
require_once dirname(dirname(dirname(__FILE__))) . '/config/response.php';
require_once dirname(dirname(dirname(__FILE__))) . '/config/database.php';
enableCORS();

if (!isset($_SESSION['admin_id'])) {
    sendError('No autorizado', 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    sendError('Método no permitido', 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    sendError('Datos inválidos', 400);
}

$id = isset($input['id']) ? intval($input['id']) : null;

if (!$id) {
    sendError('El ID es requerido', 400);
}

$updates = [];
$params = [];
$types = '';

if (isset($input['category'])) {
    $updates[] = "category = ?";
    $params[] = $input['category'];
    $types .= 's';
}
if (isset($input['title'])) {
    $updates[] = "title = ?";
    $params[] = $input['title'];
    $types .= 's';
}
if (isset($input['description'])) {
    $updates[] = "description = ?";
    $params[] = $input['description'];
    $types .= 's';
}
if (isset($input['delivery_time'])) {
    $updates[] = "delivery_time = ?";
    $params[] = $input['delivery_time'];
    $types .= 's';
}
if (isset($input['includes'])) {
    $updates[] = "includes = ?";
    $params[] = json_encode($input['includes']);
    $types .= 's';
}
if (isset($input['image_path'])) {
    $updates[] = "image_path = ?";
    $params[] = $input['image_path'];
    $types .= 's';
}

if (empty($updates)) {
    sendError('No hay datos para actualizar', 400);
}

$params[] = $id;
$types .= 'i';

$query = "UPDATE services SET " . implode(', ', $updates) . " WHERE id = ?";

$stmt = $conn->prepare($query);

if (!$stmt) {
    sendError('Error en la consulta', 500);
}

$stmt->bind_param($types, ...$params);

if (!$stmt->execute()) {
    sendError('Error al actualizar: ' . $stmt->error, 500);
}

if ($stmt->affected_rows === 0) {
    sendError('Servicio no encontrado', 404);
}

sendSuccess([], 'Servicio actualizado exitosamente', 200);

$stmt->close();
?>