<?php
require_once __DIR__ . '/env.php'; 

class Database {
    private $conn;

    public function getConnection() {
        $this->conn = null;

        // Load .env jika di lokal
        if (file_exists(__DIR__ . '/../.env')) {
            loadEnv(__DIR__ . '/../.env');
        }

        // Check for Railway DATABASE_URL first
        $database_url = $_ENV['DATABASE_URL'] ?? getenv('DATABASE_URL');
        
        if ($database_url) {
            // Parse Railway DATABASE_URL format: postgresql://user:password@host:port/database
            $url_parts = parse_url($database_url);
            $driver = 'pgsql';
            $host = $url_parts['host'];
            $port = $url_parts['port'] ?? '5432';
            $dbname = ltrim($url_parts['path'], '/');
            $user = $url_parts['user'];
            $pass = $url_parts['pass'];
        } else {
            // Fallback to individual environment variables (InfinityFree MySQL format)
            $driver = $_ENV['DB_CONNECTION'] ?? getenv('DB_CONNECTION') ?? 'mysql';
            $host = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?? 'sql212.infinityfree.com';
            $port = $_ENV['DB_PORT'] ?? getenv('DB_PORT') ?? '3306';
            $dbname = $_ENV['DB_DATABASE'] ?? getenv('DB_DATABASE') ?? 'if0_36512345_online_store';
            $user = $_ENV['DB_USERNAME'] ?? getenv('DB_USERNAME') ?? 'if0_36512345';
            $pass = $_ENV['DB_PASSWORD'] ?? getenv('DB_PASSWORD') ?? '';
        }

        try {
            if ($driver === 'mysql') {
                $dsn = "$driver:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
            } else {
                $dsn = "$driver:host=$host;port=$port;dbname=$dbname";
            }
            $this->conn = new PDO($dsn, $user, $pass);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        } catch(PDOException $e) {
            // Log error for debugging but don't expose sensitive info
            error_log("Database connection failed: " . $e->getMessage());
            
            echo json_encode([
                "success" => false,
                "message" => "Database connection failed. Please check your database configuration.",
                "error_code" => "DB_CONNECTION_ERROR"
            ]);
            exit;
        }

        return $this->conn;
    }
}
?>
