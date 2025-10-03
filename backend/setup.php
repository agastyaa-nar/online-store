<?php
// PostgreSQL Database setup script
require_once 'config/database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Read and execute the schema
    $schema = file_get_contents('database/schema.sql');
    
    // Split by semicolon but handle PostgreSQL-specific syntax
    $statements = preg_split('/;(?=\s*(?:CREATE|INSERT|DROP|ALTER|--))/', $schema);
    
    foreach ($statements as $statement) {
        $statement = trim($statement);
        if (!empty($statement) && !preg_match('/^--/', $statement)) {
            try {
                $conn->exec($statement);
            } catch (PDOException $e) {
                // Skip errors for existing objects
                if (strpos($e->getMessage(), 'already exists') === false) {
                    echo "Warning: " . $e->getMessage() . "\n";
                }
            }
        }
    }
    
    echo "PostgreSQL database setup completed successfully!\n";
    echo "Default superadmin credentials:\n";
    echo "Username: superadmin\n";
    echo "Password: password\n";
    echo "Database: online_store\n";
    echo "Host: localhost:5432\n";
    
} catch (Exception $e) {
    echo "Error setting up database: " . $e->getMessage() . "\n";
    echo "Make sure PostgreSQL is running and the database 'online_store' exists.\n";
    echo "Create database with: CREATE DATABASE online_store;\n";
}
?>
