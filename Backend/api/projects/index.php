<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once dirname(dirname(dirname(__FILE__))) . '/config/response.php';
require_once dirname(dirname(dirname(__FILE__))) . '/config/database.php';
enableCORS();

// 2. Leer qué está pidiendo React
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET' && $method !== 'OPTIONS') {
    if (!isset($_SESSION['admin_id'])) {
        sendError('No autorizado', 401);
    }
}

$json_body = file_get_contents('php://input');
$data = json_decode($json_body, true);

if (is_array($data)) {
    $_POST = array_merge($_POST, $data);
}

// 3. Dirigir el tráfico al archivo correcto
switch ($method) {
    case 'GET':
        require_once 'get.php';
        break;
        
    case 'POST':
        if (isset($_POST['id']) || isset($_GET['id'])) {
            require_once 'update.php';
        } else {
            require_once 'create.php';
        }
        break;
        
    case 'PUT':
        require_once 'update.php';
        break;
        
    case 'DELETE':
        require_once 'delete.php';
        break;
        
    default:
        sendError('Método HTTP no permitido', 405);
        break;
}