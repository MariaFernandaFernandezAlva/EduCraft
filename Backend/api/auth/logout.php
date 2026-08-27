<?php
// api/auth/logout.php

require_once dirname(dirname(dirname(__FILE__))) . '/config/response.php';
enableCORS();

session_destroy();

sendSuccess([], 'Sesión cerrada exitosamente', 200);
?>