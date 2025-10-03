<?php
// Session management for authentication
class SessionManager {
    public static function start() {
        if (session_status() === PHP_SESSION_NONE) {
            // Set session cookie parameters for CORS
            ini_set('session.cookie_samesite', 'Lax');
            ini_set('session.cookie_secure', '0'); // Set to 1 for HTTPS
            ini_set('session.cookie_httponly', '0'); // Allow JavaScript access
            session_start();
        }
    }
    
    public static function setUser($user) {
        self::start();
        $_SESSION['user'] = $user;
        $_SESSION['logged_in'] = true;
    }
    
    public static function getUser() {
        self::start();
        return isset($_SESSION['user']) ? $_SESSION['user'] : null;
    }
    
    public static function isLoggedIn() {
        self::start();
        return isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
    }
    
    public static function logout() {
        self::start();
        session_unset();
        session_destroy();
        return ['success' => true, 'message' => 'Logged out successfully'];
    }
    
    public static function requireAuth() {
        self::start();
        $isLoggedIn = self::isLoggedIn();
        $user = self::getUser();
        error_log("RequireAuth - isLoggedIn: " . ($isLoggedIn ? 'true' : 'false') . ", User: " . json_encode($user));
        if (!$isLoggedIn) {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Authentication required']);
            exit;
        }
    }
    
    public static function requireRole($role) {
        self::requireAuth();
        $user = self::getUser();
        if ($user['role'] !== $role) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Insufficient permissions']);
            exit;
        }
    }
    
    public static function requireAdmin() {
        $user = self::getUser();
        if ($user['role'] !== 'admin' && $user['role'] !== 'superadmin') {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Admin access required']);
            exit;
        }
    }
    
    public static function requireSuperAdmin() {
        self::requireAuth();
        $user = self::getUser();
        error_log("RequireSuperAdmin - User: " . json_encode($user));
        if (!$user || $user['role'] !== 'superadmin') {
            error_log("RequireSuperAdmin - Access denied. User role: " . ($user ? $user['role'] : 'null'));
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Superadmin access required']);
            exit;
        }
    }
}
?>
