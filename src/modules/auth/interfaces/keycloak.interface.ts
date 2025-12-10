/**
 * Keycloak Token Payload Interface
 * Represents the decoded JWT token from Keycloak
 */
export interface KeycloakTokenPayload {
  exp: number;
  iat: number;
  auth_time?: number;
  jti: string;
  iss: string;
  aud: string | string[];
  sub: string;
  typ: string;
  azp: string;
  session_state?: string;
  acr?: string;
  'allowed-origins'?: string[];
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [key: string]: {
      roles: string[];
    };
  };
  scope?: string;
  sid?: string;
  email_verified?: boolean;
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
}

/**
 * Authenticated User Interface
 * Represents the user after authentication
 */
export interface AuthenticatedUser {
  id: string;
  email?: string;
  username: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  emailVerified: boolean;
  roles: string[];
  realmRoles: string[];
  clientRoles: string[];
  accessToken: string;
}

/**
 * Role Types Enum
 * Define the roles available in the system
 */
export enum Role {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  GUEST = 'guest',
}

/**
 * Permission Types Enum
 * Define granular permissions for RBAC
 */
export enum Permission {
  // User permissions
  USER_READ = 'user:read',
  USER_CREATE = 'user:create',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',

  // Queue permissions
  QUEUE_READ = 'queue:read',
  QUEUE_CREATE = 'queue:create',
  QUEUE_UPDATE = 'queue:update',
  QUEUE_DELETE = 'queue:delete',
  QUEUE_MANAGE = 'queue:manage',

  // Admin permissions
  ADMIN_ACCESS = 'admin:access',
  ADMIN_MANAGE = 'admin:manage',
}

/**
 * Role-Permission Mapping
 * Maps roles to their associated permissions
 */
export const RolePermissions: Record<Role, Permission[]> = {
  [Role.ADMIN]: Object.values(Permission),
  [Role.MANAGER]: [
    Permission.USER_READ,
    Permission.USER_CREATE,
    Permission.USER_UPDATE,
    Permission.QUEUE_READ,
    Permission.QUEUE_CREATE,
    Permission.QUEUE_UPDATE,
    Permission.QUEUE_DELETE,
    Permission.QUEUE_MANAGE,
  ],
  [Role.USER]: [
    Permission.USER_READ,
    Permission.QUEUE_READ,
    Permission.QUEUE_CREATE,
  ],
  [Role.GUEST]: [Permission.QUEUE_READ],
};
