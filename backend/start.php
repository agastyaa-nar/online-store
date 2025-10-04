<?php
/**
 * Railway PHP Startup Script
 * Alternative to bash script for better environment variable handling
 */

echo "🚀 Starting Online Store Backend...\n";

// Get PORT from multiple sources
$port = $_ENV['PORT'] ?? getenv('PORT') ?? $_SERVER['PORT'] ?? 3000;

echo "🔍 Environment Debug:\n";
echo "PORT from \$_ENV: " . ($_ENV['PORT'] ?? 'NOT SET') . "\n";
echo "PORT from getenv: " . (getenv('PORT') ?: 'NOT SET') . "\n";
echo "PORT from \$_SERVER: " . ($_SERVER['PORT'] ?? 'NOT SET') . "\n";
echo "Final PORT: $port\n\n";

echo "📡 Starting PHP server on port $port\n";

// Start the server
$command = "php -S 0.0.0.0:$port";
echo "Command: $command\n";

// Execute the command
passthru($command);
?>
