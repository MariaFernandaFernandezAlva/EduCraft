<?php
// api/projects/get.php

$id = isset($_GET['id']) ? intval($_GET['id']) : null;

if ($id) {
    $query = "SELECT * FROM projects WHERE id = ?";
    $stmt = $conn->prepare($query);
    
    if (!$stmt) {
        sendError('Error en la consulta', 500);
    }
    
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        sendError('Proyecto no encontrado', 404);
    }
    
    $project = $result->fetch_assoc();
    $project['includes'] = json_decode($project['includes'], true);
    $project['project_images'] = json_decode($project['project_images'], true);
    
    sendSuccess($project, 'Proyecto obtenido correctamente', 200);
    
} else {
    $query = "SELECT * FROM projects ORDER BY created_at DESC";
    $result = $conn->query($query);
    
    if (!$result) {
        sendError('Error en la consulta', 500);
    }
    
    $projects = [];
    
    while ($row = $result->fetch_assoc()) {
        $row['includes'] = json_decode($row['includes'], true);
        $projects[] = $row;
    }
    
    sendSuccess($projects, 'Proyectos obtenidos correctamente', 200);
}

$conn->close();