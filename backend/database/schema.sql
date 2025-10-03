-- PostgreSQL Schema for Online Store
-- Create database: CREATE DATABASE online_store;

-- Users table (for all users: user, admin, superadmin)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('user', 'admin', 'superadmin')) NOT NULL DEFAULT 'user',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    category_id INTEGER,
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Cart items table (for session-based cart)
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_method VARCHAR(50) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default superadmin and admin accounts
INSERT INTO users (username, email, password, role, first_name, last_name) VALUES
('superadmin', 'superadmin@store.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'superadmin', 'Super', 'Admin'),
('admin', 'admin@store.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Admin', 'User');

-- Insert sample categories
INSERT INTO categories (name, description) VALUES 
('Electronics', 'Electronic devices and accessories'),
('Clothing', 'Fashion and apparel'),
('Home & Garden', 'Home improvement and garden supplies'),
('Sports', 'Sports equipment and accessories'),
('Books', 'Books and educational materials');

-- Insert sample products for all categories
INSERT INTO products (name, description, price, image_url, category_id, stock_quantity) VALUES 
-- Electronics (Category 1)
('Premium Wireless Headphones', 'Experience crystal-clear sound with our flagship headphones featuring noise cancellation and 30-hour battery life', 299.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 1, 50),
('Smart Watch Pro', 'Advanced fitness tracking and smart notifications with heart rate monitor and GPS', 399.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', 1, 30),
('Portable Speaker', 'High-quality wireless speaker for any occasion with 360-degree sound', 149.99, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80', 1, 75),
('USB-C Cable', 'Fast charging and data transfer cable with 100W power delivery', 19.99, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80', 1, 100),
('Phone Case', 'Protective case for your smartphone with military-grade protection', 29.99, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=80', 1, 200),
('Gaming Mouse', 'High-precision gaming mouse with RGB lighting and programmable buttons', 79.99, 'https://images.unsplash.com/photo-1527864550417-7fd91b32e6d2?w=400&q=80', 1, 60),
('Mechanical Keyboard', 'RGB mechanical keyboard with tactile switches for gaming and typing', 129.99, 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&q=80', 1, 40),
('Webcam HD', '1080p HD webcam with auto-focus and built-in microphone', 89.99, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80', 1, 25),

-- Clothing (Category 2)
('Classic White T-Shirt', '100% cotton t-shirt with comfortable fit and modern design', 24.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80', 2, 150),
('Denim Jeans', 'Classic blue denim jeans with stretch fabric for comfort', 59.99, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80', 2, 80),
('Hoodie Sweatshirt', 'Warm and cozy hoodie with kangaroo pocket and drawstring hood', 49.99, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80', 2, 60),
('Summer Dress', 'Light and breezy summer dress perfect for warm weather', 39.99, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80', 2, 45),
('Leather Jacket', 'Genuine leather jacket with classic biker style', 199.99, 'https://images.unsplash.com/photo-1551028719-001c67c4b0b4?w=400&q=80', 2, 20),
('Running Shoes', 'Lightweight running shoes with breathable mesh upper', 89.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', 2, 70),
('Winter Coat', 'Warm winter coat with down insulation and water-resistant shell', 149.99, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80', 2, 35),
('Baseball Cap', 'Adjustable baseball cap with embroidered logo', 19.99, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=80', 2, 100),

-- Home & Garden (Category 3)
('Indoor Plant Pot', 'Ceramic plant pot with drainage holes for healthy plant growth', 29.99, 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80', 3, 80),
('LED Desk Lamp', 'Adjustable LED desk lamp with touch control and USB charging port', 49.99, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', 3, 40),
('Throw Pillow Set', 'Set of 2 decorative throw pillows with removable covers', 34.99, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80', 3, 60),
('Kitchen Knife Set', 'Professional 6-piece knife set with wooden block', 79.99, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80', 3, 25),
('Garden Tools Set', 'Complete garden tools set with trowel, pruner, and gloves', 39.99, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80', 3, 30),
('Wall Clock', 'Modern wall clock with silent movement and contemporary design', 24.99, 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=400&q=80', 3, 50),
('Storage Baskets', 'Set of 3 woven storage baskets for organization', 44.99, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80', 3, 35),
('Candles Set', 'Set of 3 scented candles with different fragrances', 29.99, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80', 3, 55),

-- Sports (Category 4)
('Yoga Mat', 'Non-slip yoga mat with carrying strap and alignment lines', 34.99, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80', 4, 90),
('Dumbbell Set', 'Adjustable dumbbell set with weight plates from 5-25 lbs', 149.99, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', 4, 20),
('Basketball', 'Official size basketball with composite leather cover', 29.99, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80', 4, 40),
('Tennis Racket', 'Professional tennis racket with graphite frame', 89.99, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&q=80', 4, 25),
('Running Headband', 'Sweat-wicking headband for comfortable workouts', 12.99, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', 4, 75),
('Water Bottle', 'Insulated water bottle that keeps drinks cold for 24 hours', 24.99, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80', 4, 100),
('Resistance Bands', 'Set of 5 resistance bands with different resistance levels', 19.99, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', 4, 60),
('Gym Towel', 'Quick-dry gym towel with antimicrobial treatment', 14.99, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', 4, 80),

-- Books (Category 5)
('Programming Book', 'Complete guide to modern web development with practical examples', 49.99, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80', 5, 30),
('Cookbook', 'Healthy recipes cookbook with 200+ delicious recipes', 29.99, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', 5, 45),
('Fiction Novel', 'Bestselling fiction novel with captivating storyline', 19.99, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80', 5, 60),
('Self-Help Book', 'Personal development book with actionable life advice', 24.99, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80', 5, 40),
('Children Book', 'Illustrated children book with educational content', 15.99, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80', 5, 70),
('History Book', 'Comprehensive world history book with detailed timelines', 39.99, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80', 5, 25),
('Art Book', 'Beautiful art book featuring famous paintings and artists', 34.99, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80', 5, 35),
('Science Book', 'Popular science book explaining complex concepts simply', 27.99, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80', 5, 50);
