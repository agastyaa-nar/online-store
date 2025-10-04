<?php
/**
 * Railway Database Setup Script
 * Run this script to initialize the database on Railway
 */

require_once 'config/database.php';
require_once 'config/env.php';

// Load environment variables
if (file_exists(__DIR__ . '/.env')) {
    loadEnv(__DIR__ . '/.env');
}

try {
    $database = new Database();
    $db = $database->getConnection();
    
    echo "Database connection successful!\n";
    
    // Read and execute schema.sql
    $schema_sql = file_get_contents(__DIR__ . '/database/schema.sql');
    
    if ($schema_sql === false) {
        throw new Exception("Could not read schema.sql file");
    }
    
    // Split SQL into individual statements
    $statements = array_filter(
        array_map('trim', explode(';', $schema_sql)),
        function($stmt) {
            return !empty($stmt) && !preg_match('/^\s*--/', $stmt);
        }
    );
    
    $db->beginTransaction();
    
    foreach ($statements as $statement) {
        if (!empty($statement)) {
            $db->exec($statement);
        }
    }
    
    $db->commit();
    
    echo "Database schema created successfully!\n";
    echo "Default accounts created:\n";
    echo "- Superadmin: superadmin / password\n";
    echo "- Admin: admin / password\n";
    echo "Sample products and categories added.\n";
    
} catch (Exception $e) {
    if (isset($db)) {
        $db->rollback();
    }
    
    echo "Error setting up database: " . $e->getMessage() . "\n";
    echo "Please check your DATABASE_URL configuration.\n";
    exit(1);
}
?>
