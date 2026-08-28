<?php

if (!isset($_SESSION['admin_id'])) {
    sendError('No autorizado', 401);
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

$image_path = null;

if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    // Definir la carpeta donde se guardarán (fuera de api)
    $uploadDir = dirname(dirname(dirname(__FILE__))) . '/uploads/services/';
    
    // Crear la carpeta automáticamente si no existe
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Generar un nombre único para evitar que imágenes con el mismo nombre se chanquen
    $fileName = uniqid() . '_' . basename($_FILES['image']['name']);
    $destination = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $destination)) {
        // Esta es la URL pública que se guardará en tu base de datos
        $image_path = 'http://localhost/educraft-backend/uploads/services/' . $fileName;
    } else {
        sendError('Error al guardar la imagen en el servidor', 500);
    }
}

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