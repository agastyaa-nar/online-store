<?php
/**
 * CORS Configuration Helper
 * Flexible CORS settings for development and production
 */

function setCorsHeaders() {
    // Get the origin from the request
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    // Debug logging
    error_log("CORS Debug - Origin: " . $origin);
    error_log("CORS Debug - APP_ENV: " . ($_ENV['APP_ENV'] ?? 'not set'));
    error_log("CORS Debug - ALLOWED_ORIGINS: " . ($_ENV['ALLOWED_ORIGINS'] ?? 'not set'));
    
    // Check for production environment
    $is_production = ($_ENV['APP_ENV'] ?? 'development') === 'production';
    
    if ($is_production) {
        // Production: Use environment variable for allowed origins
        $allowed_origins = $_ENV['ALLOWED_ORIGINS'] ?? getenv('ALLOWED_ORIGINS') ?? '';
        
        // If no environment variable set, use hardcoded production origins
        if (!$allowed_origins) {
            $allowed_origins = 'https://narr-online-store.vercel.app';
        }
        
        $allowed_origins_list = explode(',', $allowed_origins);
        // Remove trailing slash for comparison
        $origin_clean = rtrim($origin, '/');
        $allowed_origins_clean = array_map(function($url) { return rtrim($url, '/'); }, $allowed_origins_list);
        
        if (in_array($origin_clean, $allowed_origins_clean)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            error_log("CORS: Allowed origin: " . $origin);
        } else {
            // Use the first allowed origin as fallback
            header('Access-Control-Allow-Origin: ' . $allowed_origins_clean[0]);
            error_log("CORS: Using fallback origin: " . $allowed_origins_clean[0] . " for request from: " . $origin);
        }
    } else {
        // Development: Allow localhost and common dev ports
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
    }
    
    // Set other CORS headers
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400'); // Cache preflight for 24 hours
    
    error_log("CORS headers set successfully");
}

// Error handling function
function handleApiError($message, $code = 500, $details = null) {
    http_response_code($code);
    
    $error_response = [
        'success' => false,
        'message' => $message,
        'timestamp' => date('Y-m-d H:i:s'),
        'code' => $code
    ];
    
    if ($details && ($_ENV['APP_DEBUG'] ?? 'false') === 'true') {
        $error_response['details'] = $details;
    }
    
    echo json_encode($error_response);
    exit;
}

// Logging function
function logApiError($message, $context = []) {
    $log_entry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'message' => $message,
        'context' => $context,
        'request_uri' => $_SERVER['REQUEST_URI'] ?? '',
        'request_method' => $_SERVER['REQUEST_METHOD'] ?? '',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? ''
    ];
    
    error_log("API Error: " . json_encode($log_entry));
}

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    setCorsHeaders();
    http_response_code(200);
    exit(0);
}
?>
