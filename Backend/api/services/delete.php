<?php
// api/services/delete.php
// DELETE /api/services?id=1 → Eliminar un servicio

require_once __DIR__ . '/../../config/response.php';
require_once __DIR__ . '/../../config/database.php';
enableCORS();

// Validar sesión
if (!isset($_SESSION['admin_id'])) {
    sendError('No autorizado', 401);
}

// Validar que sea DELETE
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    sendError('Método no permitido', 405);
}

// Obtener ID
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

if (!$id) {
    sendError('El ID del servicio es requerido', 400);
}

// Eliminar
$query = "DELETE FROM services WHERE id = ?";
$stmt = $conn->prepare($query);

if (!$stmt) {
    sendError('Error en la consulta', 500);
}

$stmt->bind_param('i', $id);

if (!$stmt->execute()) {
    sendError('Error al eliminar', 500);
}

if ($stmt->affected_rows === 0) {
    sendError('Servicio no encontrado', 404);
}

sendSuccess([], 'Servicio eliminado exitosamente', 200);

$stmt->close();
$conn->close();
?>