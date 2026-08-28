<?php
// api/projects/update.php

if (!isset($_SESSION['admin_id'])) {
    sendError('No autorizado', 401);
}

$id = isset($_POST['id']) ? $_POST['id'] : (isset($_GET['id']) ? $_GET['id'] : null);

if (!$id) {
    sendError('El ID es requerido', 400);
}

$updates = [];
$params = [];
$types = '';

if (isset($_POST['category']) && trim($_POST['category']) !== '') {
    $updates[] = "category = ?";
    $params[] = trim($_POST['category']);
    $types .= 's';
}
if (isset($_POST['category_color']) && trim($_POST['category_color']) !== '') {
    $updates[] = "category_color = ?";
    $params[] = trim($_POST['category_color']);
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
if (isset($_POST['includes'])) {
    $updates[] = "includes = ?";
    $params[] = is_string($_POST['includes']) ? $_POST['includes'] : json_encode($_POST['includes']);
    $types .= 's';
}
if (isset($_POST['project_images'])) {
    $updates[] = "project_images = ?";
    $params[] = is_string($_POST['project_images']) ? $_POST['project_images'] : json_encode($_POST['project_images']);
    $types .= 's';
}

if (isset($_FILES['project_images']) && $_FILES['project_images']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = dirname(dirname(dirname(__FILE__))) . '/uploads/projects/';
    
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $fileName = uniqid() . '_' . basename($_FILES['project_images']['name']);
    $destination = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES['project_images']['tmp_name'], $destination)) {
        $project_images = 'http://localhost/educraft-backend/uploads/projects/' . $fileName;
        
        $updates[] = "project_images = ?";
        $params[] = $project_images;
        $types .= 's';
    }
}

if (empty($updates)) {
    sendError('No hay datos para actualizar', 400);
}

$params[] = $id;
$types .= 'i';

$query = "UPDATE projects SET " . implode(', ', $updates) . " WHERE id = ?";

$stmt = $conn->prepare($query);

if (!$stmt) {
    sendError('Error en la consulta' . $conn->error, 500);
}

$stmt->bind_param($types, ...$params);

if (!$stmt->execute()) {
    sendError('Error al actualizar: ' . $stmt->error, 500);
}

sendSuccess([], 'Proyecto actualizado exitosamente', 200);

$stmt->close();