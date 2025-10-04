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

        $driver = $_ENV['DB_CONNECTION'] ?? 'pgsql';
        $host = $_ENV['DB_HOST'] ?? 'localhost';
        $port = $_ENV['DB_PORT'] ?? '5432';
        $dbname = $_ENV['DB_DATABASE'] ?? 'online_store';
        $user = $_ENV['DB_USERNAME'] ?? 'postgres';
        $pass = $_ENV['DB_PASSWORD'] ?? '';

        try {
            $dsn = "$driver:host=$host;port=$port;dbname=$dbname";
            $this->conn = new PDO($dsn, $user, $pass);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        } catch(PDOException $e) {
            echo json_encode([
                "success" => false,
                "message" => "Database connection failed: " . $e->getMessage()
            ]);
            exit;
        }

        return $this->conn;
    }
}
?>
