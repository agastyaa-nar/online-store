<?php
/**
 * Simple PHP API for Online Store
 * No external dependencies required
 */

// Load autoloader
require_once __DIR__ . '/../src/autoload.php';

// Load environment variables
if (file_exists(__DIR__ . '/../env')) {
    $lines = file(__DIR__ . '/../env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            list($key, $value) = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
        }
    }
}

// Set headers for CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? 'http://localhost:8081';
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept, Origin, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400'); // Cache preflight for 24 hours
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Log preflight request for debugging
    error_log("DEBUG: OPTIONS preflight request received");
    error_log("DEBUG: Authorization header in OPTIONS: " . ($_SERVER['HTTP_AUTHORIZATION'] ?? 'NOT SET'));
    
    // For CORS preflight, we need to allow Authorization header
    header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept, Origin, Authorization');
    http_response_code(200);
    exit();
}

// Simple routing
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];
$path = parse_url($requestUri, PHP_URL_PATH);
$path = rtrim($path, '/');

// Remove query string
$path = strtok($path, '?');

// Route to appropriate handler
switch ($path) {
    case '/health':
        echo json_encode(['status' => 'ok', 'timestamp' => date('Y-m-d H:i:s')]);
        break;
        
    case '/auth':
        $controller = new App\Controllers\AuthController();
        $controller->handleRequest();
        break;
        
    case '/products':
        $controller = new App\Controllers\ProductController();
        $controller->handleRequest();
        break;
        
    case '/categories':
        $controller = new App\Controllers\CategoryController();
        $controller->handleRequest();
        break;
        
    case '/cart':
        $controller = new App\Controllers\CartController();
        $controller->handleRequest();
        break;
        
    case '/orders':
        $controller = new App\Controllers\OrderController();
        $controller->handleRequest();
        break;
        
    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
        break;
}
