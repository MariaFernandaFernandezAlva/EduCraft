<?php
require_once dirname(dirname(dirname(__FILE__))) . '/config/response.php';
require_once dirname(dirname(dirname(__FILE__))) . '/config/database.php';
enableCORS();

if (!isset($_SESSION['admin_id'])) {
    sendError('No autorizado', 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    sendError('Método no permitido', 405);
}

$id = isset($_GET['id']) ? intval($_GET['id']) : null;

if (!$id) {
    sendError('El ID es requerido', 400);
}

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
?>