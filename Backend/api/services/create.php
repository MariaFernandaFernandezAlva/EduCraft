<?php
require_once dirname(dirname(dirname(__FILE__))) . '/config/response.php';
require_once dirname(dirname(dirname(__FILE__))) . '/config/database.php';
enableCORS();

if (!isset($_SESSION['admin_id'])) {
    sendError('No autorizado', 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Método no permitido', 405);
}

$category = getRequiredField('category');
$title = getRequiredField('title');
$description = getRequiredField('description');
$delivery_time = getRequiredField('delivery_time');

$includes = isset($_POST['includes']) ? $_POST['includes'] : '[]';

if (is_string($includes)) {
    $includes_decoded = json_decode($includes);
    if (json_last_error() !== JSON_ERROR_NONE) {
        sendError('El campo includes debe ser JSON válido', 400);
    }
} else {
    $includes = json_encode($includes);
}

$image_path = isset($_POST['image_path']) ? trim($_POST['image_path']) : null;

$query = "INSERT INTO services (category, title, description, includes, delivery_time, image_path) 
          VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($query);

if (!$stmt) {
    sendError('Error en la consulta', 500);
}

$stmt->bind_param('ssssss', $category, $title, $description, $includes, $delivery_time, $image_path);

if (!$stmt->execute()) {
    sendError('Error al crear: ' . $stmt->error, 500);
}

$service_id = $conn->insert_id;

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
?>