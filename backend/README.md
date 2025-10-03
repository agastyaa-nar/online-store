# Online Store Backend API

This is the PHP backend for the online store application.

## Setup Instructions

### 1. Database Setup
1. Create a MySQL database named `online_store`
2. Import the schema from `database/schema.sql`
3. Update database credentials in `config/database.php` if needed

### 2. Server Requirements
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server

### 3. API Endpoints

#### Authentication (`/api/auth.php`)
- `POST` - Login: `{"action": "login", "username": "admin", "password": "password"}`
- `POST` - Create User: `{"action": "create_user", "username": "admin", "email": "admin@store.com", "password": "password", "role": "admin"}`
- `GET` - Get All Users: `?action=users`
- `DELETE` - Delete User: `{"id": 1}`

#### Products (`/api/products.php`)
- `GET` - Get All Products
- `GET` - Get Product by ID: `?id=1`
- `GET` - Get Products by Category: `?category=1`
- `GET` - Search Products: `?search=keyword`
- `POST` - Create Product
- `PUT` - Update Product
- `DELETE` - Delete Product

#### Categories (`/api/categories.php`)
- `GET` - Get All Categories
- `GET` - Get Category by ID: `?id=1`
- `POST` - Create Category
- `PUT` - Update Category
- `DELETE` - Delete Category

#### Cart (`/api/cart.php`)
- `GET` - Get Cart Items: `?session_id=session123`
- `POST` - Add to Cart: `{"session_id": "session123", "product_id": 1, "quantity": 1}`
- `PUT` - Update Cart Item: `{"session_id": "session123", "product_id": 1, "quantity": 2}`
- `DELETE` - Remove from Cart: `{"session_id": "session123", "product_id": 1}`
- `DELETE` - Clear Cart: `{"session_id": "session123", "clear_all": true}`

#### Orders (`/api/orders.php`)
- `GET` - Get Orders: `?session_id=session123`
- `GET` - Get Order by ID: `?id=1`
- `POST` - Create Order
- `PUT` - Update Order Status

### 4. Default Credentials
- Superadmin: username: `superadmin`, password: `password`

### 5. CORS Configuration
All endpoints include CORS headers to allow requests from the React frontend.

### 6. Error Handling
All endpoints return JSON responses with `success` boolean and appropriate messages.
