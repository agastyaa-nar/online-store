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
    // Use environment variables (from Docker or file)
    $host = getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? 'localhost');
    $dbname = getenv('DB_NAME') ?: ($_ENV['DB_NAME'] ?? 'online_store');
    $username = getenv('DB_USER') ?: ($_ENV['DB_USER'] ?? 'postgres');
    $password = getenv('DB_PASS') ?: ($_ENV['DB_PASS'] ?? '');
    $port = getenv('DB_PORT') ?: ($_ENV['DB_PORT'] ?? '5432');
    
    echo "Connecting to database: $host:$port/$dbname as $username\n";
    echo "Environment check - DB_HOST: " . (getenv('DB_HOST') ?: 'not set') . "\n";

    // Connect to PostgreSQL
    $pdo = new PDO(
        "pgsql:host=$host;port=$port;dbname=$dbname",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );

    // Read and execute schema
    $schema = file_get_contents(__DIR__ . '/database/schema.sql');
    $pdo->exec($schema);

    echo "Database setup completed successfully!\n";
    echo "You can now start the server with: php -S localhost:3000 -t public\n";

} catch (PDOException $e) {
    echo "Error setting up database: " . $e->getMessage() . "\n";
    echo "Please check your database configuration in the 'env' file.\n";
}
?>
