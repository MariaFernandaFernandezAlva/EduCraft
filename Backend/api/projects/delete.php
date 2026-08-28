<?php
// api/projects/delete.php

if (!isset($_SESSION['admin_id'])) {
    sendError('No autorizado', 401);
}

$id = isset($_GET['id']) ? intval($_GET['id']) : null;

if (!$id) {
    sendError('El ID es requerido', 400);
}

$query = "DELETE FROM projects WHERE id = ?";
$stmt = $conn->prepare($query);

if (!$stmt) {
    sendError('Error en la consulta', 500);
}

$stmt->bind_param('i', $id);

if (!$stmt->execute()) {
    sendError('Error al eliminar', 500);
}

if ($stmt->affected_rows === 0) {
    sendError('Proyecto no encontrado', 404);
}

sendSuccess([], 'Proyecto eliminado exitosamente', 200);

$stmt->close();