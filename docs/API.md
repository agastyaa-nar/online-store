# 🔌 ArchStore API Documentation

## Base URL
```
Development: http://localhost:8080
Production: https://your-domain.com
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 🔐 Authentication

#### Login
```http
POST /auth?action=login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "user|admin|superadmin"
  },
  "token": "jwt-token"
}
```

#### Register
```http
POST /auth?action=register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Get Current User
```http
GET /auth?action=me
Authorization: Bearer <token>
```

### 📦 Products

#### Get All Products
```http
GET /products
```

#### Get Product by ID
```http
GET /products/{id}
```

#### Create Product (Admin)
```http
POST /products
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "price": "number",
  "image_url": "string",
  "category_id": "string",
  "stock": "number"
}
```

#### Update Product (Admin)
```http
PUT /products/{id}
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "price": "number",
  "image_url": "string",
  "category_id": "string",
  "stock": "number"
}
```

#### Delete Product (Admin)
```http
DELETE /products/{id}
Authorization: Bearer <admin-token>
```

### 🛒 Cart

#### Get Cart Items
```http
GET /cart
Authorization: Bearer <token>
```

#### Add to Cart
```http
POST /cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_id": "string",
  "quantity": "number"
}
```

#### Update Cart Item
```http
PUT /cart/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": "number"
}
```

#### Remove from Cart
```http
DELETE /cart/{id}
Authorization: Bearer <token>
```

### 📋 Orders

#### Get Orders
```http
GET /orders
Authorization: Bearer <token>
```

#### Create Order
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "product_id": "string",
      "quantity": "number",
      "price": "number"
    }
  ],
  "total_amount": "number"
}
```

#### Update Order Status (Admin)
```http
PUT /orders/{id}
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "pending|processing|shipped|delivered|cancelled"
}
```

### 👥 Users (Admin Only)

#### Get All Users
```http
GET /auth?action=users
Authorization: Bearer <admin-token>
```

#### Create User
```http
POST /auth?action=create_user
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "user|admin"
}
```

#### Delete User
```http
DELETE /auth
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "id": "string"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Rate Limiting

- **Authentication**: 5 requests per minute
- **API Calls**: 100 requests per hour
- **Admin Operations**: 50 requests per hour

## CORS Configuration

```php
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```
