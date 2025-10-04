# 🚀 Fix 403 Forbidden Error - InfinityFree

## ❌ **Error yang Terjadi:**
```
Failed to load resource: the server responded with a status of 403
"Forbidden" is not valid JSON
ERR_CONNECTION_REFUSED
```

## 🔍 **Root Cause Analysis:**

### 1. **403 Forbidden Error:**
- InfinityFree memblokir akses langsung ke file PHP
- Perlu `.htaccess` untuk routing yang benar
- File PHP harus diakses melalui `index.php`

### 2. **Frontend Masih Pointing ke Localhost:**
- Frontend masih menggunakan `localhost:3000`
- Perlu update API URL ke InfinityFree domain

## ✅ **Solusi Lengkap:**

### Step 1: Create .htaccess File

**Create file `.htaccess` di root `htdocs/`:**

```apache
RewriteEngine On

# Handle CORS preflight requests
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ $1 [R=200,L]

# Route API requests to index.php
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]

# Allow direct access to PHP files in public folder
RewriteCond %{REQUEST_URI} ^/public/
RewriteRule ^public/(.*)$ public/$1 [L]

# Block direct access to config and other sensitive folders
RewriteCond %{REQUEST_URI} ^/(config|database|\.env)
RewriteRule ^(.*)$ - [F,L]
```

### Step 2: Update index.php Routing

**Update `index.php` untuk handle routing yang benar:**

```php
<?php
// Load environment variables
if (file_exists(__DIR__ . '/.env')) {
    loadEnv(__DIR__ . '/.env');
}

// Set error reporting
if (($_ENV['APP_ENV'] ?? 'development') === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
}

// Load configuration
require_once __DIR__ . '/config/cors.php';

// Set CORS headers
setCorsHeaders();

// Set content type
header('Content-Type: application/json');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get request path
$request_uri = $_SERVER['REQUEST_URI'] ?? '';
$path = parse_url($request_uri, PHP_URL_PATH);

// Remove leading slash and get first segment
$segments = explode('/', trim($path, '/'));
$endpoint = $segments[0] ?? '';

// Route to appropriate API file
switch ($endpoint) {
    case 'products':
        require_once __DIR__ . '/public/products.php';
        break;
    case 'categories':
        require_once __DIR__ . '/public/categories.php';
        break;
    case 'auth':
        require_once __DIR__ . '/public/auth.php';
        break;
    case 'cart':
        require_once __DIR__ . '/public/cart.php';
        break;
    case 'orders':
        require_once __DIR__ . '/public/orders.php';
        break;
    case 'setup-infinityfree':
        require_once __DIR__ . '/setup-infinityfree.php';
        break;
    default:
        // Health check endpoint
        echo json_encode([
            'success' => true,
            'message' => 'Online Store API is running',
            'version' => '1.0.0',
            'timestamp' => date('Y-m-d H:i:s'),
            'endpoints' => [
                'GET /' => 'Health check',
                'GET /products' => 'Get all products',
                'GET /categories' => 'Get all categories',
                'POST /auth' => 'Authentication',
                'GET /cart' => 'Get cart items',
                'POST /cart' => 'Add to cart',
                'POST /orders' => 'Create order'
            ]
        ]);
        break;
}
?>
```

### Step 3: Update Frontend API URL

**Update di Vercel Environment Variables:**
```
VITE_API_BASE_URL=https://personal-web1.lovestoblog.com
```

### Step 4: Fix CORS Headers

**Update `config/cors.php` untuk handle InfinityFree:**

```php
<?php
function setCorsHeaders() {
    // Get the origin from the request
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    // Check for production environment
    $is_production = ($_ENV['APP_ENV'] ?? 'development') === 'production';
    
    if ($is_production) {
        // Production: Allow Vercel frontend
        $allowed_origins = [
            'https://narr-online-store.vercel.app',
            'https://personal-web1.lovestoblog.com'
        ];
        
        if (in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . $origin);
        } else {
            // Fallback to Vercel
            header('Access-Control-Allow-Origin: https://narr-online-store.vercel.app');
        }
    } else {
        // Development: Allow localhost
        header('Access-Control-Allow-Origin: http://localhost:3000');
    }
    
    // Set other CORS headers
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}
?>
```

### Step 5: Test API Endpoints

**Test these URLs:**
1. `https://personal-web1.lovestoblog.com/` (Health check)
2. `https://personal-web1.lovestoblog.com/products` (Products)
3. `https://personal-web1.lovestoblog.com/categories` (Categories)

## 🎯 **Expected Results:**

After fixes:
- ✅ No more 403 errors
- ✅ API returns JSON responses
- ✅ Frontend can connect to API
- ✅ CORS headers work correctly

## 📋 **Quick Fix Checklist:**

- [ ] Upload `.htaccess` file
- [ ] Update `index.php` routing
- [ ] Update `config/cors.php`
- [ ] Update frontend API URL in Vercel
- [ ] Test API endpoints
- [ ] Verify JSON responses

**403 errors should be fixed after these changes! 🚀**
