<?php

if (!isset($_SESSION['admin_id'])) {
    sendError('No autorizado', 401);
}

// 1. Obtener el ID ya sea por POST o por GET
$id = isset($_POST['id']) ? $_POST['id'] : (isset($_GET['id']) ? $_GET['id'] : null);

if (!$id) {
    sendError('ID de servicio no proporcionado', 400);
}

$updates = [];
$params = [];
$types = '';

// 2. Revisar los campos desde $_POST (ya que usamos FormData)
if (isset($_POST['category']) && trim($_POST['category']) !== '') {
    $updates[] = "category = ?";
    $params[] = trim($_POST['category']);
    $types .= 's';
}

if (isset($_POST['title']) && trim($_POST['title']) !== '') {
    $updates[] = "title = ?";
    $params[] = trim($_POST['title']);
    $types .= 's';
}

if (isset($_POST['description']) && trim($_POST['description']) !== '') {
    $updates[] = "description = ?";
    $params[] = trim($_POST['description']);
    $types .= 's';
}

if (isset($_POST['delivery_time']) && trim($_POST['delivery_time']) !== '') {
    $updates[] = "delivery_time = ?";
    $params[] = trim($_POST['delivery_time']);
    $types .= 's';
}

if (isset($_POST['includes'])) {
    $updates[] = "includes = ?";
    // Si viene como string desde FormData, lo guardamos tal cual o lo parseamos
    $params[] = is_string($_POST['includes']) ? $_POST['includes'] : json_encode($_POST['includes']);
    $types .= 's';
}

// 3. Procesar nueva imagen si el usuario seleccionó una
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = dirname(dirname(dirname(__FILE__))) . '/uploads/services/';
    
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $fileName = uniqid() . '_' . basename($_FILES['image']['name']);
    $destination = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $destination)) {
        $image_path = 'http://localhost/educraft-backend/uploads/services/' . $fileName;
        
        $updates[] = "image_path = ?";
        $params[] = $image_path;
        $types .= 's';
    }
}

// 4. Validar si hay algo que actualizar
if (empty($updates)) {
    sendError('No hay datos para actualizar', 400);
}

$params[] = $id;
$types .= 'i';

$query = "UPDATE services SET " . implode(', ', $updates) . " WHERE id = ?";

$stmt = $conn->prepare($query);

if (!$stmt) {
    sendError('Error en la consulta: ' . $conn->error, 500);
}

$stmt->bind_param($types, ...$params);

if (!$stmt->execute()) {
    sendError('Error al actualizar: ' . $stmt->error, 500);
}

sendSuccess([], 'Servicio actualizado exitosamente', 200);

$stmt->close();