<?php
// api/services/update.php
// PUT /api/services → Actualizar un servicio

require_once dirname(dirname(dirname(__FILE__))) . '/config/response.php';
require_once dirname(dirname(dirname(__FILE__))) . '/config/database.php';
enableCORS();

// Validar sesión
if (!isset($_SESSION['admin_id'])) {
    sendError('No autorizado', 401);
}

// Validar que sea PUT
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    sendError('Método no permitido', 405);
}

// Obtener datos del cuerpo (PUT usa input stream)
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    sendError('Datos inválidos', 400);
}

// Validar ID
$id = isset($input['id']) ? intval($input['id']) : null;

if (!$id) {
    sendError('El ID del servicio es requerido', 400);
}

// Obtener datos a actualizar (solo si existen)
$category = $input['category'] ?? null;
$title = $input['title'] ?? null;
$description = $input['description'] ?? null;
$delivery_time = $input['delivery_time'] ?? null;
$image_path = $input['image_path'] ?? null;
$includes = isset($input['includes']) ? json_encode($input['includes']) : null;

// Construir query dinámicamente
$updates = [];
$params = [];
$types = '';

if ($category !== null) {
    $updates[] = "category = ?";
    $params[] = $category;
    $types .= 's';
}
if ($title !== null) {
    $updates[] = "title = ?";
    $params[] = $title;
    $types .= 's';
}
if ($description !== null) {
    $updates[] = "description = ?";
    $params[] = $description;
    $types .= 's';
}
if ($delivery_time !== null) {
    $updates[] = "delivery_time = ?";
    $params[] = $delivery_time;
    $types .= 's';
}
if ($includes !== null) {
    $updates[] = "includes = ?";
    $params[] = $includes;
    $types .= 's';
}
if ($image_path !== null) {
    $updates[] = "image_path = ?";
    $params[] = $image_path;
    $types .= 's';
}

if (empty($updates)) {
    sendError('No hay datos para actualizar', 400);
}

// Agregar ID al final de parámetros
$params[] = $id;
$types .= 'i';

// Construir query final
$query = "UPDATE services SET " . implode(', ', $updates) . " WHERE id = ?";

$stmt = $conn->prepare($query);

if (!$stmt) {
    sendError('Error en la consulta', 500);
}

// Bind dinámico de parámetros
$stmt->bind_param($types, ...$params);

if (!$stmt->execute()) {
    sendError('Error al actualizar: ' . $stmt->error, 500);
}

if ($stmt->affected_rows === 0) {
    sendError('Servicio no encontrado o sin cambios', 404);
}

sendSuccess([], 'Servicio actualizado exitosamente', 200);

$stmt->close();
$conn->close();
?>