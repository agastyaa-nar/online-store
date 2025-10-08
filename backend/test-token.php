<?php
// Test token validation inside container
require_once __DIR__ . '/src/autoload.php';

use App\Models\User;

// Simulate Authorization header
$_SERVER['HTTP_AUTHORIZATION'] = 'Bearer eyJ1c2VyX2lkIjoidXNlci0xIiwidXNlcm5hbWUiOiJzdXBlcmFkbWluIiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE3NTk4ODg4MzQsImV4cCI6MTc1OTk3NTIzNH0=';

echo "Authorization header: " . ($_SERVER['HTTP_AUTHORIZATION'] ?? 'NOT SET') . "\n";

$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
echo "Auth header: $authHeader\n";

if (empty($authHeader) || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
    echo "No Bearer token found\n";
    exit;
}

$token = $matches[1];
echo "Token: $token\n";

try {
    $decoded = json_decode(base64_decode($token), true);
    echo "Decoded: " . print_r($decoded, true) . "\n";
    
    if (!$decoded || $decoded['exp'] < time()) {
        echo "Token expired or invalid\n";
        exit;
    }
    
    $userModel = new User();
    $user = $userModel->findById($decoded['user_id']);
    echo "User found: " . print_r($user, true) . "\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
