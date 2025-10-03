# 🛍️ NeonStore - Modern E-commerce Platform

A full-stack e-commerce application built with React, TypeScript, Tailwind CSS, and PHP with PostgreSQL. Features a modern neon-themed UI with complete admin dashboard, user management, and shopping cart functionality.

## ✨ Features

### 🎨 Frontend Features
- **Modern Neon Theme**: Dark theme with neon green accents and glow effects
- **Responsive Design**: Mobile-first design that works on all devices
- **Product Catalog**: Browse products with filtering, sorting, and search
- **Shopping Cart**: Add/remove items with real-time updates
- **User Authentication**: Separate login systems for users and admins
- **Admin Dashboard**: Complete product and user management
- **Collection Page**: Advanced filtering with category, price range, and search
- **Load More**: Pagination for better performance

### 🔧 Backend Features
- **RESTful API**: Clean API endpoints for all operations
- **PostgreSQL Database**: Robust data storage with proper relationships
- **Session Management**: Secure authentication and authorization
- **Role-Based Access**: User, Admin, and Superadmin roles
- **CORS Support**: Flexible CORS for development and production
- **Data Validation**: Server-side validation for all inputs

### 🛡️ Security Features
- **Password Hashing**: Secure password storage
- **Session Management**: Secure session handling
- **Role-Based Access Control**: Different permissions for different roles
- **Input Validation**: Both client and server-side validation
- **SQL Injection Protection**: Prepared statements for all queries

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PHP 8.0+
- PostgreSQL 12+
- Composer (for PHP dependencies)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd online-store
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   composer install
   ```

4. **Setup Database**
   ```sql
   CREATE DATABASE neonstore;
   \c neonstore;
   ```

5. **Run Database Migration**
   ```bash
   cd backend
   php migrate.php
   ```

6. **Configure Environment**
   - Update `backend/config/database.php` with your database credentials
   - Update `src/services/api.ts` with your API base URL

### Development

1. **Start Backend Server**
   ```bash
   cd backend
   php -S localhost:3000 -t .
   ```

2. **Start Frontend Development Server**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

### Test Coverage
The project includes comprehensive unit tests for:
- React components
- Utility functions
- API services
- Context providers
- Page components

## 📁 Project Structure

```
online-store/
├── src/                          # Frontend source code
│   ├── components/               # Reusable UI components
│   │   ├── ui/                  # Shadcn UI components
│   │   ├── Navbar.tsx           # Navigation component
│   │   ├── ProductCard.tsx      # Product display component
│   │   └── Footer.tsx           # Footer component
│   ├── pages/                   # Page components
│   │   ├── Index.tsx            # Home page
│   │   ├── CollectionPage.tsx   # Product collection page
│   │   ├── ProductDetail.tsx    # Product detail page
│   │   ├── Cart.tsx             # Shopping cart page
│   │   ├── Checkout.tsx         # Checkout page
│   │   ├── AdminDashboard.tsx   # Admin dashboard
│   │   ├── UserLogin.tsx        # User login page
│   │   ├── UserRegister.tsx     # User registration page
│   │   ├── AdminLogin.tsx       # Admin login page
│   │   └── AdminRegister.tsx    # Admin registration page
│   ├── contexts/                # React contexts
│   │   ├── AuthContext.tsx      # Authentication context
│   │   └── CartContext.tsx      # Shopping cart context
│   ├── services/                # API services
│   │   └── api.ts               # API client
│   ├── utils/                   # Utility functions
│   │   └── formatPrice.ts       # Price formatting utility
│   ├── hooks/                   # Custom React hooks
│   │   └── use-toast.ts         # Toast notification hook
│   ├── __tests__/               # Test files
│   └── setupTests.ts            # Test setup configuration
├── backend/                     # Backend source code
│   ├── api/                     # API endpoints
│   │   ├── auth.php             # Authentication API
│   │   ├── products.php         # Products API
│   │   ├── cart.php             # Shopping cart API
│   │   ├── categories.php       # Categories API
│   │   └── orders.php           # Orders API
│   ├── config/                  # Configuration files
│   │   ├── database.php         # Database configuration
│   │   ├── cors.php             # CORS configuration
│   │   └── session.php          # Session management
│   ├── migrate.php              # Database migration script
│   └── seed.php                 # Database seeding script
├── public/                      # Static assets
├── package.json                 # Frontend dependencies
├── composer.json                # Backend dependencies
├── tailwind.config.ts           # Tailwind CSS configuration
├── vite.config.ts               # Vite configuration
├── vitest.config.ts             # Vitest configuration
└── README.md                    # This file
```

## 🔧 Configuration

### Frontend Configuration
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe JavaScript
- **React Router**: Client-side routing
- **React Query**: Data fetching and caching
- **Shadcn UI**: Component library

### Backend Configuration
- **PHP 8.0+**: Server-side language
- **PostgreSQL**: Database
- **PDO**: Database abstraction layer
- **Session Management**: Custom session handling
- **CORS**: Cross-origin resource sharing

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npx vercel --prod
   ```

3. **Deploy to Netlify**
   ```bash
   npm run build
   # Upload dist/ folder to Netlify
   ```

### Backend Deployment (VPS/Shared Hosting)

1. **Upload backend files**
   ```bash
   # Upload backend/ folder to your server
   ```

2. **Install PHP dependencies**
   ```bash
   composer install --no-dev --optimize-autoloader
   ```

3. **Configure web server**
   ```apache
   # Apache .htaccess
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ index.php [QSA,L]
   ```

4. **Setup database**
   ```bash
   # Run migration on production database
   php migrate.php
   ```

5. **Configure environment**
   - Update database credentials
   - Set production API URL
   - Configure CORS for production domain

### Docker Deployment

1. **Create Dockerfile for frontend**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "run", "preview"]
   ```

2. **Create Dockerfile for backend**
   ```dockerfile
   FROM php:8.0-apache
   WORKDIR /var/www/html
   COPY . .
   RUN apt-get update && apt-get install -y \
       libpq-dev \
       && docker-php-ext-install pdo pdo_pgsql
   EXPOSE 80
   ```

3. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     frontend:
       build: .
       ports:
         - "3000:3000"
     backend:
       build: ./backend
       ports:
         - "8000:80"
     database:
       image: postgres:13
       environment:
         POSTGRES_DB: neonstore
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: password
       volumes:
         - postgres_data:/var/lib/postgresql/data
   ```

## 🔐 Default Accounts

### Admin Accounts
- **Superadmin**: `superadmin` / `admin123`
- **Admin**: `admin` / `admin123`

### User Account
- **User**: `user` / `user123`

## 📊 API Endpoints

### Authentication
- `POST /api/auth.php` - Login/Register
- `GET /api/auth.php?action=me` - Get current user
- `GET /api/auth.php?action=users` - Get all users (Superadmin only)

### Products
- `GET /api/products.php` - Get all products
- `GET /api/products.php?id={id}` - Get product by ID
- `POST /api/products.php` - Create product (Admin only)
- `PUT /api/products.php` - Update product (Admin only)
- `DELETE /api/products.php` - Delete product (Admin only)

### Categories
- `GET /api/categories.php` - Get all categories

### Cart
- `GET /api/cart.php?session_id={id}` - Get cart items
- `POST /api/cart.php` - Add item to cart
- `PUT /api/cart.php` - Update cart item
- `DELETE /api/cart.php` - Remove item from cart

### Orders
- `GET /api/orders.php` - Get orders
- `POST /api/orders.php` - Create order

## 🎨 Theme Customization

The application uses a custom neon theme with the following color palette:

- **Primary**: Neon Green (`hsl(142 76% 36%)`)
- **Secondary**: Neon Purple (`hsl(280 100% 70%)`)
- **Accent**: Neon Blue (`hsl(200 100% 70%)`)
- **Background**: Dark (`hsl(240 10% 3.9%)`)
- **Foreground**: Light (`hsl(0 0% 98%)`)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run the test suite
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using React, TypeScript, PHP, and PostgreSQL**