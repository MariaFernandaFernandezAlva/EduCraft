<?php
// index.php
// Router principal que redirecciona todas las solicitudes a los endpoints correctos

// Cargar configuración
require_once __DIR__ . '/config/response.php';
enableCORS();

// Obtener la ruta solicitada desde .htaccess
$request = isset($_GET['request']) ? $_GET['request'] : '';
$method = $_SERVER['REQUEST_METHOD'];

// Dividir la ruta en segmentos
// Ejemplo: "api/auth/login" → ["api", "auth", "login"]
$segments = array_filter(explode('/', $request));
$segments = array_values($segments); // Reindexar array

// Validar que exista al menos un segmento
if (empty($segments)) {
    sendError('Ruta no encontrada', 404);
}

// Determinar qué endpoint cargar según la ruta
// Estructura: /api/{recurso}/{accion}

if (count($segments) < 2) {
    sendError('Ruta incompleta', 400);
}

$resource = $segments[0];  // "api"
$entity = $segments[1];    // "auth", "services", "projects", etc.
$action = isset($segments[2]) ? $segments[2] : null;  // "login", "create", etc. (opcional)

// Logging para debug (opcional)
// error_log("Ruta: $request | Método: $method | Entity: $entity | Action: $action");

// Enrutador principal
// ============================================

// AUTENTICACIÓN
if ($entity === 'auth') {
    $action = $action ?? $method; // Si no hay acción, usar el método HTTP
    
    switch ($action) {
        case 'login':
        case 'POST':
            require __DIR__ . '/api/auth/login.php';
            break;
        
        case 'verify':
        case 'GET':
            require __DIR__ . '/api/auth/verify.php';
            break;
        
        case 'logout':
            require __DIR__ . '/api/auth/logout.php';
            break;
        
        default:
            sendError('Acción de autenticación no encontrada', 404);
    }
}

// SERVICIOS
else if ($entity === 'services') {
    switch ($method) {
        case 'GET':
            require __DIR__ . '/api/services/get.php';
            break;
        
        case 'POST':
            require __DIR__ . '/api/services/create.php';
            break;
        
        case 'PUT':
            require __DIR__ . '/api/services/update.php';
            break;
        
        case 'DELETE':
            require __DIR__ . '/api/services/delete.php';
            break;
        
        default:
            sendError('Método no permitido', 405);
    }
}

// PROYECTOS (para después)
else if ($entity === 'projects') {
    switch ($method) {
        case 'GET':
            require __DIR__ . '/api/projects/get.php';
            break;
        case 'POST':
            require __DIR__ . '/api/projects/create.php';
            break;
        case 'PUT':
            require __DIR__ . '/api/projects/update.php';
            break;
        case 'DELETE':
            require __DIR__ . '/api/projects/delete.php';
            break;
        default:
            sendError('Método no permitido', 405);
    }
}

// COTIZACIONES (para después)
else if ($entity === 'quotations') {
    switch ($method) {
        case 'GET':
            require __DIR__ . '/api/quotations/get.php';
            break;
        case 'POST':
            require __DIR__ . '/api/quotations/create.php';
            break;
        case 'PUT':
            require __DIR__ . '/api/quotations/update.php';
            break;
        default:
            sendError('Método no permitido', 405);
    }
}

// TESTIMONIOS (para después)
else if ($entity === 'testimonies') {
    switch ($method) {
        case 'GET':
            require __DIR__ . '/api/testimonies/get.php';
            break;
        case 'POST':
            require __DIR__ . '/api/testimonies/create.php';
            break;
        case 'PUT':
            require __DIR__ . '/api/testimonies/update.php';
            break;
        case 'DELETE':
            require __DIR__ . '/api/testimonies/delete.php';
            break;
        default:
            sendError('Método no permitido', 405);
    }
}

// RUTA NO ENCONTRADA
else {
    sendError('Recurso no encontrado: ' . $entity, 404);
}
?>