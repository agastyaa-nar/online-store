<?php
/**
 * Environment Debug Script
 * Use this to debug Railway environment variables
 */

echo "🔍 Railway Environment Debug\n";
echo "============================\n\n";

// Check PORT variable
echo "PORT: " . ($_ENV['PORT'] ?? getenv('PORT') ?? 'NOT SET') . "\n";
echo "APP_ENV: " . ($_ENV['APP_ENV'] ?? getenv('APP_ENV') ?? 'NOT SET') . "\n";
echo "DATABASE_URL: " . (isset($_ENV['DATABASE_URL']) || getenv('DATABASE_URL') ? 'SET' : 'NOT SET') . "\n";

// Check if we can connect to database
try {
    require_once 'config/database.php';
    $database = new Database();
    $db = $database->getConnection();
    echo "DATABASE: ✅ Connected\n";
} catch (Exception $e) {
    echo "DATABASE: ❌ " . $e->getMessage() . "\n";
}

// Check PHP version
echo "PHP VERSION: " . phpversion() . "\n";

// Check loaded extensions
echo "EXTENSIONS: " . implode(', ', get_loaded_extensions()) . "\n";

echo "\n🚀 Ready to start server on port: " . ($_ENV['PORT'] ?? getenv('PORT') ?? '3000') . "\n";
?>
