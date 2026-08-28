<?php

if (!isset($_SESSION['admin_id'])) {
    sendError('No autorizado', 401);
}

$category = getRequiredField('category');
$category_color = getRequiredField('category_color');
$title = getRequiredField('title');
$description = getRequiredField('description');

$includes = isset($_POST['includes']) ? $_POST['includes'] : '[]';
if (is_string($includes)) {
    json_decode($includes);
    if (json_last_error() !== JSON_ERROR_NONE) {
        sendError('El campo includes debe ser JSON válido', 400);
    }
} else {
    $includes = json_encode($includes);
}

$project_images = null;

if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    // Definir la carpeta donde se guardarán (fuera de api)
    $uploadDir = dirname(dirname(dirname(__FILE__))) . '/uploads/projects/';
    
    // Crear la carpeta automáticamente si no existe
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Generar un nombre único para evitar que imágenes con el mismo nombre se chanquen
    $fileName = uniqid() . '_' . basename($_FILES['image']['name']);
    $destination = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $destination)) {
        // Esta es la URL pública que se guardará en tu base de datos
        $project_images = 'http://localhost/educraft-backend/uploads/projects/' . $fileName;
    } else {
        sendError('Error al guardar la imagen en el servidor', 500);
    }
}

$query = "INSERT INTO projects (category, category_color, title, description, includes, project_images) 
          VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($query);

if (!$stmt) {
    sendError('Error en la consulta', 500);
}

$stmt->bind_param('ssssss', $category, $category_color, $title, $description, $includes, $project_images);

if (!$stmt->execute()) {
    sendError('Error al crear: ' . $stmt->error, 500);
}

$project_id = $conn->insert_id;

sendSuccess([
    'id' => $project_id,
    'image' => $image,
    'category' => $category,
    'category_color' => $category_color,
    'title' => $title,
    'description' => $description,
    'includes' => json_decode($includes, true),
    'project_images' => json_decode($project_images, true)
], 'Proyecto creado exitosamente', 201);

$stmt->close();