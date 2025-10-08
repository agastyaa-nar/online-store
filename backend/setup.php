<?php
require_once __DIR__ . '/src/autoload.php';

// Load environment variables from file if it exists
$envFile = __DIR__ . '/env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            list($key, $value) = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
        }
    }
}

try {
    // Debug: Show environment variables
    echo "=== Environment Variables Debug ===\n";
    echo "DB_HOST: " . (getenv('DB_HOST') ?: 'not set') . "\n";
    echo "DB_NAME: " . (getenv('DB_NAME') ?: 'not set') . "\n";
    echo "DB_USER: " . (getenv('DB_USER') ?: 'not set') . "\n";
    echo "DB_PASS: " . (getenv('DB_PASS') ?: 'not set') . "\n";
    echo "DB_PORT: " . (getenv('DB_PORT') ?: 'not set') . "\n";
    echo "DATABASE_URL: " . (getenv('DATABASE_URL') ?: 'not set') . "\n";
    echo "=====================================\n";
    
    // Check if DATABASE_URL is provided (for Render deployment)
    $databaseUrl = getenv('DATABASE_URL');
    if ($databaseUrl) {
        echo "Using DATABASE_URL format\n";
        $url = parse_url($databaseUrl);
        $host = $url['host'] ?? 'localhost';
        $dbname = ltrim($url['path'] ?? '/online_store', '/');
        $username = $url['user'] ?? 'postgres';
        $password = $url['pass'] ?? '';
        $port = $url['port'] ?? '5432';
    } else {
        // Use individual environment variables (configured in render.yaml)
        $host = getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? 'localhost');
        $dbname = getenv('DB_NAME') ?: ($_ENV['DB_NAME'] ?? 'online_store');
        $username = getenv('DB_USER') ?: ($_ENV['DB_USER'] ?? 'postgres');
        $password = getenv('DB_PASS') ?: ($_ENV['DB_PASS'] ?? '');
        $port = getenv('DB_PORT') ?: ($_ENV['DB_PORT'] ?? '5432');
    }
    
    echo "Final connection parameters:\n";
    echo "Host: $host\n";
    echo "Port: $port\n";
    echo "Database: $dbname\n";
    echo "Username: $username\n";
    echo "Password: " . (empty($password) ? 'empty' : 'set') . "\n";

    // Connect to PostgreSQL with retry logic
    $maxRetries = 10;
    $retryDelay = 2;
    $pdo = null;
    
    for ($i = 0; $i < $maxRetries; $i++) {
        try {
            $pdo = new PDO(
                "pgsql:host=$host;port=$port;dbname=$dbname",
                $username,
                $password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]
            );
            echo "Database connection successful on attempt " . ($i + 1) . "\n";
            break;
        } catch (PDOException $e) {
            echo "Connection attempt " . ($i + 1) . " failed: " . $e->getMessage() . "\n";
            if ($i < $maxRetries - 1) {
                echo "Retrying in $retryDelay seconds...\n";
                sleep($retryDelay);
            } else {
                throw $e;
            }
        }
    }

    // Read and execute schema
    $schema = file_get_contents(__DIR__ . '/database/schema.sql');
    $pdo->exec($schema);

    echo "Database setup completed successfully!\n";
    echo "You can now start the server with: php -S localhost:3000 -t public\n";

} catch (PDOException $e) {
    echo "Error setting up database: " . $e->getMessage() . "\n";
    echo "Database setup failed, but continuing with application startup...\n";
    echo "The database will be set up when it becomes available.\n";
    exit(0); // Exit successfully so Apache can start
}
?>
