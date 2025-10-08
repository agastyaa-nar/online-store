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
        // Check if DATABASE_URL is provided (for Render deployment)
        $databaseUrl = getenv('DATABASE_URL');
        if ($databaseUrl) {
            $url = parse_url($databaseUrl);
            $host = $url['host'] ?? 'localhost';
            $dbname = ltrim($url['path'] ?? '/online_store', '/');
            $username = $url['user'] ?? 'postgres';
            $password = $url['pass'] ?? '';
            $port = $url['port'] ?? '5432';
        } else {
            // Fallback to individual environment variables
            $host = getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? 'localhost');
            $dbname = getenv('DB_NAME') ?: ($_ENV['DB_NAME'] ?? 'online_store');
            $username = getenv('DB_USER') ?: ($_ENV['DB_USER'] ?? 'postgres');
            $password = getenv('DB_PASS') ?: ($_ENV['DB_PASS'] ?? '');
            $port = getenv('DB_PORT') ?: ($_ENV['DB_PORT'] ?? '5432');
            
            // For Render, try alternative environment variable names
            if (getenv('RENDER')) {
                $host = getenv('DB_HOST') ?: getenv('DATABASE_HOST') ?: $host;
                $dbname = getenv('DB_NAME') ?: getenv('DATABASE_NAME') ?: $dbname;
                $username = getenv('DB_USER') ?: getenv('DATABASE_USER') ?: $username;
                $password = getenv('DB_PASS') ?: getenv('DATABASE_PASSWORD') ?: $password;
                $port = getenv('DB_PORT') ?: getenv('DATABASE_PORT') ?: $port;
            }
        }

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
