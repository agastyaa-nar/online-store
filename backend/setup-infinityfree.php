<?php
/**
 * InfinityFree Database Setup Script
 * Run this script to initialize the database on InfinityFree
 */

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/env.php';

// Load environment variables
if (file_exists(__DIR__ . '/.env')) {
    loadEnv(__DIR__ . '/.env');
}

echo "🚀 Starting InfinityFree Database Setup...\n\n";

try {
    $database = new Database();
    $db = $database->getConnection();
    
    echo "✅ Database connection successful!\n";
    
    // Read and execute MySQL schema
    $schema_sql = file_get_contents(__DIR__ . '/database/schema.sql');
    
    if ($schema_sql === false) {
        throw new Exception("Could not read schema.sql file");
    }
    
    echo "📖 Reading MySQL database schema...\n";
    
    // Split SQL into individual statements
    $statements = array_filter(
        array_map('trim', explode(';', $schema_sql)),
        function($stmt) {
            return !empty($stmt) && !preg_match('/^\s*--/', $stmt);
        }
    );
    
    echo "📝 Executing " . count($statements) . " SQL statements...\n";
    
    $db->beginTransaction();
    
    $executed = 0;
    foreach ($statements as $statement) {
        if (!empty($statement)) {
            $db->exec($statement);
            $executed++;
        }
    }
    
    $db->commit();
    
    echo "✅ Database schema created successfully!\n";
    echo "📊 Executed $executed SQL statements\n\n";
    
    // Verify setup
    $stmt = $db->query("SELECT COUNT(*) as count FROM users");
    $userCount = $stmt->fetch()['count'];
    
    $stmt = $db->query("SELECT COUNT(*) as count FROM categories");
    $categoryCount = $stmt->fetch()['count'];
    
    $stmt = $db->query("SELECT COUNT(*) as count FROM products");
    $productCount = $stmt->fetch()['count'];
    
    echo "📈 Database Statistics:\n";
    echo "   - Users: $userCount\n";
    echo "   - Categories: $categoryCount\n";
    echo "   - Products: $productCount\n\n";
    
    echo "🔑 Default Login Credentials:\n";
    echo "   - Superadmin: superadmin / password\n";
    echo "   - Admin: admin / password\n\n";
    
    echo "🎉 InfinityFree database setup completed successfully!\n";
    
} catch (Exception $e) {
    if (isset($db)) {
        $db->rollback();
    }
    
    echo "❌ Error setting up database: " . $e->getMessage() . "\n";
    echo "🔧 Please check your database configuration.\n";
    echo "📋 Make sure MySQL database is created in InfinityFree.\n";
    exit(1);
}
?>
