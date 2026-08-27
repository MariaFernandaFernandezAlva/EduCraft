<?php
// api/services/create.php
// POST /api/services → Crear nuevo servicio

require_once dirname(dirname(dirname(__FILE__))) . '/config/response.php';
require_once dirname(dirname(dirname(__FILE__))) . '/config/database.php';
enableCORS();

// Validar sesión del admin
if (!isset($_SESSION['admin_id'])) {
    sendError('No autorizado - Debes iniciar sesión', 401);
}

// Validar que sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Método no permitido', 405);
}

// Obtener y validar datos
$category = getRequiredField('category');
$title = getRequiredField('title');
$description = getRequiredField('description');
$delivery_time = getRequiredField('delivery_time');

// Includes es un array JSON
$includes = isset($_POST['includes']) ? $_POST['includes'] : '[]';

// Si includes viene como JSON string, validar que sea JSON válido
if (is_string($includes)) {
    $includes_decoded = json_decode($includes);
    if (json_last_error() !== JSON_ERROR_NONE) {
        sendError('El campo "includes" debe ser un JSON válido', 400);
    }
    $includes = $includes; // Mantener como string JSON
} else {
    // Si viene como array, convertir a JSON
    $includes = json_encode($includes);
}

// image_path es opcional
$image_path = isset($_POST['image_path']) ? trim($_POST['image_path']) : null;

// Insertar en BD
$query = "INSERT INTO services (category, title, description, includes, delivery_time, image_path) 
          VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($query);

if (!$stmt) {
    sendError('Error en la consulta', 500);
}

$stmt->bind_param('ssssss', $category, $title, $description, $includes, $delivery_time, $image_path);

if (!$stmt->execute()) {
    sendError('Error al crear el servicio: ' . $stmt->error, 500);
}

// Obtener el ID del servicio creado
$service_id = $conn->insert_id;

// Retornar el servicio creado
sendSuccess([
    'id' => $service_id,
    'category' => $category,
    'title' => $title,
    'description' => $description,
    'includes' => json_decode($includes, true),
    'delivery_time' => $delivery_time,
    'image_path' => $image_path
], 'Servicio creado exitosamente', 201);

$stmt->close();
$conn->close();
?>