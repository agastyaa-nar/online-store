<?php

namespace App\Models;

use PDO;
use PDOException;

class Database
{
    private static $instance = null;
    private $connection;

    private function __construct()
    {
        $host = getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? 'localhost');
        $dbname = getenv('DB_NAME') ?: ($_ENV['DB_NAME'] ?? 'online_store');
        $username = getenv('DB_USER') ?: ($_ENV['DB_USER'] ?? 'postgres');
        $password = getenv('DB_PASS') ?: ($_ENV['DB_PASS'] ?? '');
        $port = getenv('DB_PORT') ?: ($_ENV['DB_PORT'] ?? '5432');

        try {
            $this->connection = new PDO(
                "pgsql:host=$host;port=$port;dbname=$dbname",
                $username,
                $password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );
        } catch (PDOException $e) {
            throw new \Exception("Database connection failed: " . $e->getMessage());
        }
    }

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection()
    {
        return $this->connection;
    }
}
