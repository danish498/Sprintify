# Keycloak Authentication & Authorization Setup

This document provides instructions for setting up Keycloak authentication and RBAC (Role-Based Access Control) for the Smart Queue application.

## Table of Contents

- [Overview](#overview)
- [Quick Start with Docker](#quick-start-with-docker)
- [Keycloak Realm Setup](#keycloak-realm-setup)
- [API Usage](#api-usage)
- [RBAC Configuration](#rbac-configuration)
- [Development Notes](#development-notes)

## Overview

The Smart Queue application uses Keycloak for:
- **Authentication**: JWT-based authentication with Keycloak tokens
- **Authorization**: Role-Based Access Control (RBAC) with roles and permissions

### Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│  NestJS API │────▶│  Keycloak   │
│  (Frontend) │     │   Server    │     │   Server    │
└─────────────┘     └─────────────┘     └─────────────┘
      │                    │                   │
      │  1. Login Request  │                   │
      │───────────────────▶│                   │
      │                    │  2. Validate      │
      │                    │─────────────────▶│
      │                    │  3. Token         │
      │                    │◀─────────────────│
      │  4. JWT Token      │                   │
      │◀───────────────────│                   │
      │                    │                   │
      │  5. API Request    │                   │
      │   (with JWT)       │                   │
      │───────────────────▶│                   │
      │                    │  6. Verify Token  │
      │                    │─────────────────▶│
      │  7. Response       │                   │
      │◀───────────────────│                   │
```

## Quick Start with Docker

### 1. Start the Services

```bash
docker-compose up -d
```

This will start:
- PostgreSQL (for app data)
- Redis
- Keycloak (on port 8080)
- Keycloak PostgreSQL database
- NestJS application

### 2. Access Keycloak Admin Console

1. Open http://localhost:8080
2. Login with:
   - Username: `admin`
   - Password: `admin`

## Keycloak Realm Setup

### Step 1: Create a New Realm

1. Click "Create Realm"
2. Set Realm name: `smart-queue`
3. Click "Create"

### Step 2: Create a Client

1. Go to **Clients** → **Create client**
2. Configure:
   - **Client ID**: `smart-queue-api`
   - **Client Protocol**: `openid-connect`
3. Click "Next"
4. Configure capabilities:
   - **Client authentication**: ON
   - **Authorization**: ON (optional, for fine-grained permissions)
5. Click "Next"
6. Configure access settings:
   - **Valid redirect URIs**: `http://localhost:3000/*`
   - **Web origins**: `http://localhost:3000`
7. Click "Save"

### Step 3: Get Client Secret

1. Go to **Clients** → `smart-queue-api` → **Credentials**
2. Copy the **Client secret**
3. Add it to your `.env` file:
   ```env
   KEYCLOAK_CLIENT_SECRET=your-copied-secret
   ```

### Step 4: Create Roles

1. Go to **Realm roles** → **Create role**
2. Create the following roles:
   - `admin` - Full system access
   - `manager` - Manage users and queues
   - `user` - Basic user access
   - `guest` - Read-only access

### Step 5: Create Users

1. Go to **Users** → **Add user**
2. Create test users:

**Admin User:**
- Username: `admin`
- Email: `admin@example.com`
- Email verified: ON
- Go to **Credentials** → Set password → Temporary: OFF
- Go to **Role mapping** → Assign role → `admin`

**Manager User:**
- Username: `manager`
- Email: `manager@example.com`
- Role: `manager`

**Regular User:**
- Username: `user`
- Email: `user@example.com`
- Role: `user`

### Step 6: Enable Direct Access Grants (Optional)

For password-based login via API:
1. Go to **Clients** → `smart-queue-api` → **Settings**
2. Enable **Direct access grants**

## API Usage

### Authentication Endpoints

#### Login (Password Grant)

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin@example.com",
    "password": "your-password"
  }'
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 300,
  "refreshExpiresIn": 1800,
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "scope": "openid profile email"
}
```

#### Refresh Token

```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your-refresh-token"
  }'
```

#### Get User Profile

```bash
curl http://localhost:3000/auth/profile \
  -H "Authorization: Bearer your-access-token"
```

#### Logout

```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer your-access-token" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your-refresh-token"
  }'
```

### Protected Endpoints Examples

#### Public Endpoint (No Auth Required)

```bash
curl http://localhost:3000/queue
```

#### User Role Required

```bash
curl http://localhost:3000/users/me \
  -H "Authorization: Bearer your-access-token"
```

#### Manager/Admin Role Required

```bash
curl http://localhost:3000/users \
  -H "Authorization: Bearer your-access-token"
```

#### Admin Only

```bash
curl -X DELETE http://localhost:3000/users/1 \
  -H "Authorization: Bearer your-access-token"
```

## RBAC Configuration

### Available Roles

| Role | Description | Access Level |
|------|-------------|--------------|
| `admin` | Full system access | All permissions |
| `manager` | Manage users and queues | Read/Write users and queues |
| `user` | Basic user access | Read access, create queues |
| `guest` | Read-only access | Read queues only |

### Available Permissions

| Permission | Description |
|------------|-------------|
| `user:read` | View users |
| `user:create` | Create users |
| `user:update` | Update users |
| `user:delete` | Delete users |
| `queue:read` | View queues |
| `queue:create` | Join/create queues |
| `queue:update` | Update queues |
| `queue:delete` | Delete queues |
| `queue:manage` | Manage queue operations |
| `admin:access` | Access admin features |
| `admin:manage` | Manage admin settings |

### Using Decorators

```typescript
import { Controller, Get, Post, Delete } from '@nestjs/common';
import { Roles, Permissions, Public, CurrentUser } from './auth/decorators';
import { Role, Permission, AuthenticatedUser } from './auth/interfaces';

@Controller('example')
export class ExampleController {
  
  // Public endpoint - no authentication required
  @Public()
  @Get('public')
  publicEndpoint() {
    return { message: 'Public data' };
  }

  // Authenticated endpoint - any authenticated user
  @Get('protected')
  protectedEndpoint(@CurrentUser() user: AuthenticatedUser) {
    return { message: `Hello ${user.username}` };
  }

  // Role-based access
  @Roles(Role.ADMIN, Role.MANAGER)
  @Get('admin-manager')
  adminManagerOnly() {
    return { message: 'Admin or Manager only' };
  }

  // Permission-based access
  @Permissions(Permission.USER_CREATE)
  @Post('create-user')
  createUser() {
    return { message: 'User created' };
  }

  // Combined roles and permissions
  @Roles(Role.ADMIN)
  @Permissions(Permission.USER_DELETE)
  @Delete('delete-user/:id')
  deleteUser() {
    return { message: 'User deleted' };
  }
}
```

### Role-Permission Mapping

```typescript
const RolePermissions = {
  admin: [/* all permissions */],
  manager: [
    'user:read', 'user:create', 'user:update',
    'queue:read', 'queue:create', 'queue:update', 
    'queue:delete', 'queue:manage'
  ],
  user: ['user:read', 'queue:read', 'queue:create'],
  guest: ['queue:read']
};
```

## Development Notes

### Environment Variables

```env
# Required Keycloak Configuration
KEYCLOAK_AUTH_SERVER_URL=http://localhost:8080
KEYCLOAK_REALM=smart-queue
KEYCLOAK_CLIENT_ID=smart-queue-api
KEYCLOAK_CLIENT_SECRET=your-client-secret

# Optional: Static public key (skip JWKS lookup)
# KEYCLOAK_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----...
```

### Testing Without Keycloak

For development/testing without Keycloak:

1. Use the `@Public()` decorator on endpoints
2. Create mock guards for testing

### Security Best Practices

1. **Always use HTTPS in production**
2. **Keep client secrets secure** - never commit to version control
3. **Use short token expiration** - recommended: 5-15 minutes for access tokens
4. **Implement token refresh** - use refresh tokens for seamless UX
5. **Validate tokens server-side** - always verify JWT signatures
6. **Use role hierarchy carefully** - admin should have all permissions

### Troubleshooting

#### "Invalid token" Error
- Check if Keycloak is running
- Verify `KEYCLOAK_AUTH_SERVER_URL` is correct
- Ensure the realm name matches

#### "Forbidden" Error
- Check user roles in Keycloak
- Verify role names match exactly (case-sensitive)
- Check if user has required permissions

#### CORS Issues
- Add your frontend URL to Keycloak client's **Web origins**
- Ensure NestJS CORS is configured properly

### API Documentation

Swagger documentation is available at: http://localhost:3000/api

All endpoints are documented with:
- Required authentication
- Required roles/permissions
- Request/response schemas
