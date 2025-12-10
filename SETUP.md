# Smart Queue - Setup Guide

## 📦 Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Additional Production Dependencies

```bash
npm install @nestjs/config class-validator class-transformer helmet compression
```

### 3. Install Type Definitions

```bash
npm install -D @types/compression
```

## 🔧 Configuration

### 1. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure your environment variables:

```env
NODE_ENV=development
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=smart_queue
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
CORS_ORIGIN=*
```

## 🚀 Running the Application

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
# Build the application
npm run build

# Run in production
npm run start:prod
```

### Debug Mode

```bash
npm run start:debug
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📁 Project Structure

```
src/
├── common/                     # Shared application code
│   ├── constants/             # Application constants
│   ├── decorators/            # Custom decorators
│   ├── dto/                   # Shared DTOs
│   ├── filters/               # Exception filters
│   ├── guards/                # Auth guards
│   ├── interceptors/          # Request/Response interceptors
│   ├── interfaces/            # TypeScript interfaces
│   ├── middleware/            # Custom middleware
│   ├── pipes/                 # Validation pipes
│   └── utils/                 # Utility functions
│
├── config/                    # Configuration files
│   └── app.config.ts         # App configuration
│
├── database/                  # Database related
│   ├── entities/             # Database entities
│   ├── migrations/           # DB migrations
│   └── seeds/                # Database seeds
│
├── modules/                   # Feature modules
│   ├── auth/                 # Authentication
│   ├── users/                # User management
│   └── queue/                # Queue management
│
├── app.module.ts             # Root module
├── app.controller.ts         # Root controller
├── app.service.ts            # Root service
└── main.ts                   # Application entry
```

## 🔐 Security Features

- **Helmet**: Secures HTTP headers
- **CORS**: Configurable cross-origin resource sharing
- **Validation**: Input validation with class-validator
- **Exception Handling**: Global exception filters
- **Request Logging**: Comprehensive request/response logging

## 📊 API Features

- **Global Prefix**: `/api/v1`
- **Response Transformation**: Consistent response structure
- **Error Handling**: Standardized error responses
- **Validation**: Automatic DTO validation
- **Compression**: Response compression enabled

## 🛠️ Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type safety
- **Jest**: Testing framework

## 📝 Next Steps

1. **Database Integration**
   - Install TypeORM or Prisma
   - Configure database connection
   - Create entities/models

2. **Authentication**
   - Install Passport & JWT
   - Implement auth guards
   - Create login/register endpoints

3. **API Documentation**
   - Install @nestjs/swagger
   - Add API documentation
   - Generate Swagger UI

4. **Logging**
   - Install Winston or Pino
   - Configure structured logging
   - Add log levels

5. **Caching**
   - Install @nestjs/cache-manager
   - Configure Redis
   - Add caching strategies

6. **Queue System**
   - Install @nestjs/bull
   - Configure Redis
   - Create job processors

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using the port
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Rebuild the project
npm run build
```

## 📚 Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Class Validator](https://github.com/typestack/class-validator)
- [Class Transformer](https://github.com/typestack/class-transformer)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## 📄 License

UNLICENSED - Private Project
