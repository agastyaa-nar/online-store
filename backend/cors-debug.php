<?php
/**
 * CORS Debug Script
 * Use this to debug CORS issues
 */

echo "🔍 CORS Debug Information\n";
echo "========================\n\n";

// Check environment variables
echo "Environment Variables:\n";
echo "APP_ENV: " . ($_ENV['APP_ENV'] ?? 'NOT SET') . "\n";
echo "ALLOWED_ORIGINS: " . ($_ENV['ALLOWED_ORIGINS'] ?? 'NOT SET') . "\n";
echo "getenv ALLOWED_ORIGINS: " . (getenv('ALLOWED_ORIGINS') ?: 'NOT SET') . "\n\n";

// Check request origin
$origin = $_SERVER['HTTP_ORIGIN'] ?? 'NOT SET';
echo "Request Origin: $origin\n\n";

// Simulate CORS logic
$is_production = ($_ENV['APP_ENV'] ?? 'development') === 'production';
echo "Is Production: " . ($is_production ? 'YES' : 'NO') . "\n";

if ($is_production) {
    $allowed_origins = $_ENV['ALLOWED_ORIGINS'] ?? getenv('ALLOWED_ORIGINS') ?? '';
    
    if (!$allowed_origins) {
        $allowed_origins = 'https://narr-online-store.vercel.app';
        echo "Using hardcoded origins: $allowed_origins\n";
    } else {
        echo "Using env origins: $allowed_origins\n";
    }
    
    $allowed_origins_list = explode(',', $allowed_origins);
    $origin_clean = rtrim($origin, '/');
    $allowed_origins_clean = array_map(function($url) { return rtrim($url, '/'); }, $allowed_origins_list);
    
    echo "Origin clean: $origin_clean\n";
    echo "Allowed origins clean: " . implode(', ', $allowed_origins_clean) . "\n";
    
    if (in_array($origin_clean, $allowed_origins_clean)) {
        echo "✅ Origin MATCHED - CORS should work\n";
    } else {
        echo "❌ Origin NOT MATCHED - CORS will fail\n";
        echo "Will use fallback: " . $allowed_origins_clean[0] . "\n";
    }
} else {
    echo "Development mode - using localhost origins\n";
}

echo "\n🚀 Test this URL:\n";
echo "https://online-store-production-c330.up.railway.app/cors-debug.php\n";
?>
