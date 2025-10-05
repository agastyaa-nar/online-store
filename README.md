# 🛍️ Online Store - Full Stack E-commerce Application

A complete full-stack e-commerce application built with **PHP Backend** and **React Frontend**, featuring modern UI/UX design with neon theme and comprehensive shopping functionality.

## 🌟 Features

### 🎨 Frontend (React + TypeScript)
- **Modern UI/UX** with neon theme and gradient effects
- **Responsive Design** for all devices
- **Shopping Cart** with session management
- **Product Catalog** with advanced filtering
- **User Authentication** (Login/Register)
- **Admin Dashboard** for product management
- **Order Management** system
- **Price Range Filtering** with smart category counts
- **Search & Sort** functionality

### 🔧 Backend (PHP + PostgreSQL)
- **RESTful API** with clean architecture
- **MVC Pattern** implementation
- **JWT Authentication** system
- **PostgreSQL Database** integration
- **CORS Support** for cross-origin requests
- **Role-based Access Control** (User, Admin, Superadmin)
- **Product CRUD** operations
- **Cart Management** with session support
- **Order Processing** system

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation
- **Lucide React** for icons
- **React Context** for state management

### Backend
- **PHP 8+** with PDO
- **PostgreSQL** database
- **JWT** for authentication
- **CORS** middleware
- **MVC Architecture**
- **Environment Configuration**

## 📁 Project Structure

```
online-store/
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   ├── Navbar.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   └── Footer.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── Index.tsx
│   │   │   ├── CollectionPage.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── Cart.tsx
│   │   │   └── Checkout.tsx
│   │   ├── contexts/        # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   └── CartContext.tsx
│   │   ├── services/        # API services
│   │   │   └── api.ts
│   │   └── utils/           # Utility functions
│   └── package.json
├── backend/                  # PHP Backend
│   ├── src/
│   │   ├── Controllers/     # API Controllers
│   │   │   ├── AuthController.php
│   │   │   ├── ProductController.php
│   │   │   ├── CartController.php
│   │   │   └── OrderController.php
│   │   ├── Models/          # Database Models
│   │   │   ├── User.php
│   │   │   ├── Product.php
│   │   │   ├── Cart.php
│   │   │   └── Order.php
│   │   ├── Routes/          # Route definitions
│   │   └── Middleware/      # CORS middleware
│   ├── database/
│   │   ├── schema.sql       # Database schema
│   │   └── clean-schema.sql
│   ├── public/
│   │   └── index.php        # Main entry point
│   └── env                  # Environment config
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** 18+ and npm
- **PHP** 8+ with PDO extension
- **PostgreSQL** 12+
- **Composer** (optional, not used in this project)

### 1. Clone Repository
```bash
git clone https://github.com/agastyaa-nar/online-store.git
cd online-store
```

### 2. Backend Setup

#### Database Setup
```bash
# Create PostgreSQL database
createdb online_store

# Run database schema
psql -d online_store -f backend/database/schema.sql
```

#### Environment Configuration
```bash
# Copy environment template
cp backend/env.example backend/env

# Edit backend/env with your database credentials
DB_HOST=localhost
DB_NAME=online_store
DB_USER=postgres
DB_PASS=your_password
DB_PORT=5432
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:8080
```

#### Start Backend Server
```bash
cd backend
php -S localhost:3000 -t public
```

### 3. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Environment Configuration
```bash
# Create frontend/env file
echo "VITE_API_BASE_URL=http://localhost:3000" > env
```

#### Start Frontend Server
```bash
npm run dev
```

## 🎯 API Endpoints

### Authentication
- `POST /auth?action=login` - User login
- `POST /auth?action=register` - User registration
- `POST /auth?action=create_user` - Create admin user (admin only)
- `GET /auth?action=me` - Get current user
- `GET /auth?action=users` - Get all users (admin only)
- `DELETE /auth?action=delete_user` - Delete user (admin only)

### Products
- `GET /products` - Get all products
- `GET /products?id={id}` - Get product by ID
- `POST /products` - Create product (admin only)
- `PUT /products` - Update product (admin only)
- `DELETE /products` - Delete product (admin only)

### Categories
- `GET /categories` - Get all categories

### Cart
- `GET /cart?session_id={id}` - Get cart items
- `POST /cart` - Add item to cart
- `PUT /cart` - Update cart item
- `DELETE /cart` - Remove cart item

### Orders
- `GET /orders` - Get user orders
- `POST /orders` - Create order
- `GET /orders?action=all` - Get all orders (admin only)

## 👥 User Roles

### 🔵 User (Regular Customer)
- Browse products
- Add to cart
- Place orders
- View order history
- Update profile

### 🟡 Admin
- All user permissions
- Manage products (CRUD)
- View all orders
- Create other admin users

### 🔴 Superadmin
- All admin permissions
- Manage all users
- System administration
- Full access control

## 🎨 UI Components

### Design System
- **Neon Theme** with gradient effects
- **Responsive Grid** layouts
- **Interactive Animations**
- **Modern Typography**
- **Consistent Spacing**

### Key Components
- **ProductCard** - Product display with add to cart
- **Navbar** - Navigation with user menu
- **AdminDashboard** - Product and user management
- **Cart** - Shopping cart with quantity controls
- **Checkout** - Order processing flow

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development
```bash
cd backend
php -S localhost:3000 -t public    # Start PHP server
php setup.php                       # Setup database
```

### Database Management
```bash
# Reset database
psql -d online_store -f backend/database/clean-schema.sql
psql -d online_store -f backend/database/schema.sql
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_BASE_URL=your-backend-url`

### Backend (Any PHP Hosting)
1. Upload backend files to server
2. Create PostgreSQL database
3. Run database schema
4. Configure environment variables
5. Set up CORS for your frontend domain

## 📊 Database Schema

### Tables
- **users** - User accounts and authentication
- **categories** - Product categories
- **products** - Product catalog
- **cart_items** - Shopping cart items
- **orders** - Order records
- **order_items** - Order line items

### Sample Data
- Default admin: `admin` / `password`
- Default superadmin: `superadmin` / `password`
- Sample products and categories included

## 🎯 Features in Detail

### 🛒 Shopping Experience
- **Product Browsing** with category filters
- **Advanced Search** with real-time results
- **Price Range Filtering** with smart category counts
- **Sort Options** (name, price, date)
- **Product Details** with image gallery
- **Add to Cart** with quantity selection

### 🛍️ Cart & Checkout
- **Session-based Cart** persistence
- **Quantity Management** with +/- controls
- **Price Calculation** with totals
- **Checkout Process** with form validation
- **Order Confirmation** with details

### 👨‍💼 Admin Features
- **Product Management** (CRUD operations)
- **User Management** (view, create, delete)
- **Order Management** (view all orders)
- **Dashboard Analytics** with statistics
- **Role-based Access** control

## 🔒 Security Features

- **JWT Authentication** with secure tokens
- **Password Hashing** with PHP password_hash()
- **CORS Protection** with configurable origins
- **Input Validation** on all endpoints
- **SQL Injection Prevention** with PDO prepared statements
- **Role-based Authorization** for admin functions

## 🎨 Styling & Theme

### Neon Theme Elements
- **Gradient Backgrounds** with neon effects
- **Glowing Borders** on interactive elements
- **Animated Transitions** for smooth UX
- **Color Scheme**: Primary blues, accent purples
- **Typography**: Modern sans-serif fonts

### Responsive Design
- **Mobile-first** approach
- **Breakpoints**: sm, md, lg, xl
- **Flexible Grid** layouts
- **Touch-friendly** interactions

## 🐛 Troubleshooting

### Common Issues

#### Backend Connection Issues
```bash
# Check PHP server
php -S localhost:3000 -t public

# Verify database connection
php setup.php
```

#### Frontend Build Issues
```bash
# Clear node modules
rm -rf node_modules package-lock.json
npm install

# Check environment variables
cat frontend/env
```

#### Database Issues
```bash
# Reset database
psql -d online_store -f backend/database/clean-schema.sql
psql -d online_store -f backend/database/schema.sql
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email support@example.com or create an issue in the GitHub repository.

## 🎉 Acknowledgments

- **shadcn/ui** for the amazing component library
- **Tailwind CSS** for the utility-first CSS framework
- **React** team for the excellent frontend framework
- **PHP** community for the robust backend language

---

**Made with ❤️ by [Your Name]**

*Built for modern e-commerce with cutting-edge technology*