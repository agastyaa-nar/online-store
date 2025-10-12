# 🤝 Contributing to ArchStore

Thank you for your interest in contributing to ArchStore! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please read and follow our Code of Conduct.

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, trolling, insulting, or derogatory comments
- Public or private harassment
- Publishing others' private information without permission
- Other unprofessional conduct

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PHP 8.2+
- PostgreSQL 15+
- Docker & Docker Compose
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
```bash
git clone https://github.com/YOUR_USERNAME/online-store.git
cd online-store
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/agastyaa-nar/online-store.git
```

## 🛠️ Development Setup

### 1. Backend Setup
```bash
cd backend

# Copy environment file
cp env.example .env

# Edit configuration
nano .env

# Start with Docker
docker-compose up --build
```

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Database Setup
```bash
# Access backend container
docker-compose exec app bash

# Initialize database
php setup.php
```

## 📝 Contributing Guidelines

### Types of Contributions

- 🐛 **Bug Fixes**: Fix existing issues
- ✨ **New Features**: Add new functionality
- 📚 **Documentation**: Improve docs
- 🧪 **Tests**: Add or improve tests
- 🎨 **UI/UX**: Improve user interface
- ⚡ **Performance**: Optimize code
- 🔒 **Security**: Enhance security

### Before You Start

1. Check existing issues and pull requests
2. Create an issue for significant changes
3. Discuss major changes with maintainers
4. Ensure your changes align with project goals

## 🔄 Pull Request Process

### 1. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 2. Make Changes
- Write clean, readable code
- Follow coding standards
- Add tests for new features
- Update documentation

### 3. Commit Changes
```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add user authentication system

- Implement JWT-based authentication
- Add login/logout functionality
- Include password hashing
- Add user role management

Closes #123"
```

### 4. Push and Create PR
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 📏 Code Standards

### Frontend (TypeScript/React)

#### File Structure
```
src/
├── components/     # Reusable components
├── pages/        # Page components
├── contexts/     # React contexts
├── services/     # API services
├── utils/        # Utility functions
└── types/        # TypeScript types
```

#### Naming Conventions
```typescript
// Components: PascalCase
const UserProfile = () => {};

// Functions: camelCase
const handleUserLogin = () => {};

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:8080';

// Interfaces: PascalCase with 'I' prefix
interface IUser {
  id: string;
  username: string;
}
```

#### Code Style
```typescript
// Use functional components
const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = async () => {
    setIsLoading(true);
    try {
      await onEdit(user.id);
    } catch (error) {
      console.error('Edit failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-card">
      <h3>{user.username}</h3>
      <button onClick={handleEdit} disabled={isLoading}>
        {isLoading ? 'Editing...' : 'Edit'}
      </button>
    </div>
  );
};
```

### Backend (PHP)

#### File Structure
```
src/
├── Controllers/   # API Controllers
├── Models/       # Data Models
├── Routes/       # API Routes
├── Middleware/   # Middleware
└── Utils/        # Utility classes
```

#### Naming Conventions
```php
// Classes: PascalCase
class UserController {}

// Methods: camelCase
public function getUserById($id) {}

// Variables: camelCase
$userData = [];

// Constants: UPPER_SNAKE_CASE
const MAX_LOGIN_ATTEMPTS = 5;
```

#### Code Style
```php
<?php

namespace App\Controllers;

use App\Models\User;
use App\Middleware\AuthMiddleware;

class UserController
{
    private $userModel;
    private $authMiddleware;

    public function __construct()
    {
        $this->userModel = new User();
        $this->authMiddleware = new AuthMiddleware();
    }

    public function handleRequest()
    {
        $method = $_SERVER['REQUEST_METHOD'];
        
        switch ($method) {
            case 'GET':
                $this->getUsers();
                break;
            case 'POST':
                $this->createUser();
                break;
            default:
                $this->methodNotAllowed();
        }
    }

    private function getUsers()
    {
        try {
            $users = $this->userModel->getAll();
            echo json_encode([
                'success' => true,
                'data' => $users
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to fetch users'
            ]);
        }
    }
}
```

## 🧪 Testing

### Frontend Testing
```bash
cd frontend

# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- --testNamePattern="UserCard"
```

### Backend Testing
```bash
cd backend

# Run PHP tests
vendor/bin/phpunit

# Run specific test
vendor/bin/phpunit tests/UserTest.php
```

### Test Structure
```
tests/
├── frontend/
│   ├── components/
│   ├── pages/
│   └── utils/
└── backend/
    ├── Controllers/
    ├── Models/
    └── Utils/
```

### Writing Tests
```typescript
// Frontend test example
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from '../UserCard';

describe('UserCard', () => {
  it('renders user information correctly', () => {
    const user = { id: '1', username: 'testuser' };
    render(<UserCard user={user} onEdit={jest.fn()} />);
    
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    const user = { id: '1', username: 'testuser' };
    
    render(<UserCard user={user} onEdit={onEdit} />);
    fireEvent.click(screen.getByText('Edit'));
    
    expect(onEdit).toHaveBeenCalledWith('1');
  });
});
```

```php
// Backend test example
<?php

use PHPUnit\Framework\TestCase;
use App\Models\User;

class UserTest extends TestCase
{
    private $userModel;

    protected function setUp(): void
    {
        $this->userModel = new User();
    }

    public function testCreateUser()
    {
        $userData = [
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => 'password123',
            'role' => 'user'
        ];

        $result = $this->userModel->create($userData);
        
        $this->assertTrue($result);
    }

    public function testFindUserByUsername()
    {
        $user = $this->userModel->findByUsername('testuser');
        
        $this->assertNotNull($user);
        $this->assertEquals('testuser', $user['username']);
    }
}
```

## 📚 Documentation

### Code Documentation
```typescript
/**
 * UserCard component for displaying user information
 * @param user - User object containing user data
 * @param onEdit - Callback function when edit button is clicked
 * @param onDelete - Callback function when delete button is clicked
 */
interface UserCardProps {
  user: User;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
}
```

```php
/**
 * User model for handling user-related database operations
 * 
 * @package App\Models
 * @author Your Name <your.email@example.com>
 * @version 1.0.0
 */
class User
{
    /**
     * Create a new user
     * 
     * @param array $data User data including username, email, password
     * @return bool True on success, false on failure
     * @throws InvalidArgumentException If required fields are missing
     */
    public function create(array $data): bool
    {
        // Implementation
    }
}
```

### README Updates
- Update feature lists
- Add new installation steps
- Update API documentation
- Include new screenshots

## 🏷️ Commit Message Format

Use conventional commits format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples
```
feat(auth): add JWT token refresh functionality

- Implement automatic token refresh
- Add refresh token storage
- Update authentication flow

Closes #123
```

```
fix(api): resolve CORS issues with frontend

- Update CORS middleware
- Add proper headers
- Test cross-origin requests

Fixes #456
```

## 🔍 Code Review Process

### For Contributors
1. Ensure your code follows standards
2. Add tests for new features
3. Update documentation
4. Respond to review feedback
5. Keep PRs focused and small

### For Reviewers
1. Check code quality and standards
2. Verify tests are included
3. Test functionality manually
4. Provide constructive feedback
5. Approve when ready

## 🐛 Reporting Issues

### Bug Reports
Use the bug report template:
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Version: [e.g. 1.0.0]
```

### Feature Requests
Use the feature request template:
```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features you've considered.

**Additional context**
Add any other context about the feature request.
```

## 🎯 Development Workflow

### 1. Planning
- Create issue for new features
- Discuss approach with team
- Break down into smaller tasks

### 2. Development
- Create feature branch
- Write code following standards
- Add tests
- Update documentation

### 3. Testing
- Run all tests
- Test manually
- Check for regressions

### 4. Review
- Create pull request
- Address feedback
- Get approval

### 5. Merge
- Squash commits if needed
- Delete feature branch
- Update issue status

## 📞 Getting Help

### Resources
- [GitHub Issues](https://github.com/agastyaa-nar/online-store/issues)
- [GitHub Discussions](https://github.com/agastyaa-nar/online-store/discussions)
- [Documentation](https://github.com/agastyaa-nar/online-store/wiki)

### Contact
- **Maintainer**: Agastyaa Nar
- **Email**: agastyaa.nar@example.com
- **GitHub**: [@agastyaa-nar](https://github.com/agastyaa-nar)

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation
- GitHub contributors page

---

**Thank you for contributing to ArchStore! 🚀**

Every contribution, no matter how small, helps make ArchStore better for everyone.
