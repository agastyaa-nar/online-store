# 📁 Project Structure Documentation

## 🏗️ Overview
Online Store adalah aplikasi e-commerce full-stack yang dibangun dengan **PHP Backend** dan **React Frontend**. Dokumentasi ini menjelaskan setiap file dan fungsinya dalam membangun website ini.

---

## 🔧 Backend Structure

### 📂 Root Directory
```
backend/
├── composer.json          # PHP dependency management
├── Dockerfile            # Container configuration
├── docker-compose.yml    # Multi-container setup
├── setup.php            # Database initialization
├── env.example          # Environment variables template
├── env                  # Environment variables (local)
├── env.production       # Environment variables (production)
├── render.yaml          # Render.com deployment config
└── README-DEPLOYMENT.md # Deployment instructions
```

### 📂 Database
```
backend/database/
└── schema.sql           # Database schema definition
```

### 📂 Public API
```
backend/public/
└── index.php            # Main API entry point & router
```

### 📂 Source Code
```
backend/src/
├── autoload.php         # Class autoloader
├── Controllers/         # API controllers
├── Models/              # Database models
├── Middleware/          # Request middleware
└── Routes/              # API route definitions
```

---

## 🎨 Frontend Structure

### 📂 Root Directory
```
frontend/
├── package.json         # Node.js dependencies
├── vite.config.ts       # Vite build configuration
├── tailwind.config.ts   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
├── components.json      # Shadcn/ui components config
└── index.html           # HTML entry point
```

### 📂 Source Code
```
frontend/src/
├── main.tsx            # React app entry point
├── App.tsx             # Main app component & routing
├── App.css             # Global styles
├── index.css           # CSS entry point
├── vite-env.d.ts       # Vite type definitions
├── components/         # Reusable UI components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API services
├── utils/              # Utility functions
└── lib/                # Library configurations
```

---

## 🔗 Integration Points

### API Communication
- **Backend**: PHP REST API dengan PDO database
- **Frontend**: React dengan fetch API calls
- **Authentication**: JWT tokens dengan localStorage
- **CORS**: Handled by CorsMiddleware

### Database
- **Type**: MySQL/PostgreSQL
- **ORM**: PDO (PHP Data Objects)
- **Schema**: Defined in `backend/database/schema.sql`
- **Initialization**: `backend/setup.php`

### Deployment
- **Backend**: Render.com dengan Docker
- **Frontend**: Vercel dengan Vite build
- **Database**: Render PostgreSQL atau external service

---

## 📊 Architecture Overview

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   Frontend      │ ◄──────────────► │    Backend      │
│   (React)       │                 │     (PHP)       │
└─────────────────┘                 └─────────────────┘
         │                                    │
         │                                    │
         ▼                                    ▼
┌─────────────────┐                 ┌─────────────────┐
│   Browser       │                 │   Database      │
│   (localStorage)│                 │ (MySQL/Postgres)│
└─────────────────┘                 └─────────────────┘
```

---

## 🚀 Getting Started

### Backend Setup
1. Install dependencies: `composer install`
2. Configure environment: Copy `env.example` to `env`
3. Setup database: Run `php setup.php`
4. Start server: `docker-compose up -d`

### Frontend Setup
1. Install dependencies: `npm install`
2. Start development: `npm run dev`
3. Build production: `npm run build`

---

## 📋 File Categories

### 🔐 Authentication & Security
- JWT token management
- CORS handling
- Password hashing
- Route protection

### 🛒 E-commerce Features
- Product management
- Shopping cart
- Order processing
- User management

### 🎨 UI/UX Components
- Responsive design
- Modern UI components
- Loading states
- Error handling

### 🔧 Development Tools
- TypeScript support
- Hot reloading
- Linting & formatting
- Docker containerization

---

*Dokumentasi ini akan diperbarui secara berkala sesuai dengan perkembangan proyek.*
