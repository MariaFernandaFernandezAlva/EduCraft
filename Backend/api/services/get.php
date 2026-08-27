<?php
// api/services/get.php
// GET /api/services → Obtener todos los servicios
// GET /api/services?id=1 → Obtener un servicio por ID

require_once __DIR__ . '/../../config/response.php';
require_once __DIR__ . '/../../config/database.php';
enableCORS();

// Validar que sea GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Método no permitido', 405);
}

// Verificar si se solicita un servicio específico por ID
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

if ($id) {
    // Obtener UN servicio por ID
    $query = "SELECT * FROM services WHERE id = ?";
    $stmt = $conn->prepare($query);
    
    if (!$stmt) {
        sendError('Error en la consulta', 500);
    }
    
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        sendError('Servicio no encontrado', 404);
    }
    
    $service = $result->fetch_assoc();
    
    // Decodificar el JSON del campo 'includes'
    $service['includes'] = json_decode($service['includes'], true);
    
    sendSuccess($service, 'Servicio obtenido correctamente', 200);
    
} else {
    // Obtener TODOS los servicios
    $query = "SELECT * FROM services ORDER BY created_at DESC";
    $result = $conn->query($query);
    
    if (!$result) {
        sendError('Error en la consulta', 500);
    }
    
    $services = [];
    
    while ($row = $result->fetch_assoc()) {
        // Decodificar el JSON de 'includes'
        $row['includes'] = json_decode($row['includes'], true);
        $services[] = $row;
    }
    
    sendSuccess($services, 'Servicios obtenidos correctamente', 200);
}

$conn->close();
?>