-- Clean schema for PostgreSQL - drops all tables and recreates them
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
DROP FUNCTION IF EXISTS update_updated_at_column;

-- Online Store Database Schema for PostgreSQL
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'superadmin')),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    category_id VARCHAR(36) REFERENCES categories(id),
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(100) NOT NULL,
    product_id VARCHAR(36) REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_first_name VARCHAR(50),
    customer_last_name VARCHAR(50),
    customer_phone VARCHAR(20),
    customer_address TEXT,
    customer_city VARCHAR(100),
    customer_zip_code VARCHAR(20),
    customer_country VARCHAR(100),
    shipping_method VARCHAR(50),
    payment_method VARCHAR(50),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(36) REFERENCES orders(id),
    product_id VARCHAR(36) REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_order_items_updated_at BEFORE UPDATE ON order_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample categories
INSERT INTO categories (id, name, description) VALUES 
('cat-1', 'Electronics', 'Electronic devices and gadgets'),
('cat-2', 'Fashion', 'Clothing and accessories'),
('cat-3', 'Home & Garden', 'Home improvement and garden supplies'),
('cat-4', 'Sports', 'Sports equipment and accessories'),
('cat-5', 'Books', 'Books and educational materials');

-- Insert sample products
INSERT INTO products (id, name, description, price, image_url, category_id, stock_quantity) VALUES 
('prod-1', 'Premium Wireless Headphones', 'High-quality wireless headphones with noise cancellation', 299.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 'cat-1', 50),
('prod-2', 'Smart Watch Pro', 'Advanced smartwatch with fitness tracking and notifications', 399.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', 'cat-1', 30),
('prod-3', 'Portable Speaker', 'Bluetooth speaker with excellent sound quality', 149.99, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80', 'cat-1', 75),
('prod-4', 'Gaming Laptop', 'High-performance gaming laptop with RTX graphics', 1299.99, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80', 'cat-1', 15),
('prod-5', 'Wireless Mouse', 'Ergonomic wireless mouse with precision tracking', 49.99, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80', 'cat-1', 100),
('prod-6', 'Designer T-Shirt', 'Premium cotton t-shirt with modern design', 29.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80', 'cat-2', 200),
('prod-7', 'Running Shoes', 'Comfortable running shoes for all terrains', 89.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', 'cat-2', 80),
('prod-8', 'Coffee Maker', 'Automatic coffee maker with programmable features', 79.99, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80', 'cat-3', 40),
('prod-9', 'Yoga Mat', 'Non-slip yoga mat for home and studio use', 24.99, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80', 'cat-4', 60),
('prod-10', 'Programming Book', 'Complete guide to modern web development', 39.99, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80', 'cat-5', 25);

-- Insert sample users
INSERT INTO users (id, username, email, password_hash, role, first_name, last_name, is_active) VALUES 
('user-1', 'superadmin', 'superadmin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'superadmin', 'Super', 'Admin', true),
('user-2', 'admin', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Admin', 'User', true);
