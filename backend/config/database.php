<?php
require_once __DIR__ . '/env.php';

class Database {
    private $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            // load .env
            loadEnv(__DIR__ . '/../.env');

            $host = $_ENV['DB_HOST'];
            $port = $_ENV['DB_PORT'];
            $dbname = $_ENV['DB_DATABASE'];
            $user = $_ENV['DB_USERNAME'];
            $pass = $_ENV['DB_PASSWORD'];

            $this->conn = new PDO(
                "{$_ENV['DB_CONNECTION']}:host=$host;port=$port;dbname=$dbname",
                $user,
                $pass
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
