<?php
/**
 * CORS Configuration Helper
 * Flexible CORS settings for development and production
 */

function setCorsHeaders() {
    // Get the origin from the request
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    // Define allowed origins
    $allowedOrigins = [
        'http://localhost:8080',
        'http://localhost:8081', 
        'http://localhost:8082',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:8080',
        'http://127.0.0.1:8081',
        'http://127.0.0.1:8082',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
    ];
    
    // Check if origin is allowed
    if (in_array($origin, $allowedOrigins)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    } else {
        // For development, allow any localhost port
        if (preg_match('/^https?:\/\/localhost(:\d+)?$/', $origin)) {
            header('Access-Control-Allow-Origin: ' . $origin);
        } else if (preg_match('/^https?:\/\/127\.0\.0\.1(:\d+)?$/', $origin)) {
            header('Access-Control-Allow-Origin: ' . $origin);
        } else {
            // Fallback to default
            header('Access-Control-Allow-Origin: http://localhost:8080');
        }
    }
    
    // Set other CORS headers
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // Cache preflight for 24 hours
}

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    setCorsHeaders();
    http_response_code(200);
    exit(0);
}
?>
