import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import {
  AuthenticatedUser,
  Permission,
  Role,
  RolePermissions,
} from '../interfaces/keycloak.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no permissions are specified, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as AuthenticatedUser | undefined;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const userPermissions = this.getUserPermissions(user.roles);
    const hasPermission = this.matchPermissions(
      requiredPermissions,
      userPermissions,
    );

    if (!hasPermission) {
      this.logger.warn(
        `User ${user.username} attempted to access resource requiring permissions: ${requiredPermissions.join(', ')}`,
      );
      throw new ForbiddenException(
        'You do not have the required permissions to access this resource',
      );
    }

    return true;
  }

  private getUserPermissions(userRoles: string[]): Permission[] {
    const permissions: Set<Permission> = new Set();

    userRoles.forEach((role) => {
      const rolePermissions = RolePermissions[role as Role];
      if (rolePermissions) {
        rolePermissions.forEach((permission) => permissions.add(permission));
      }
    });

    return Array.from(permissions);
  }

  private matchPermissions(
    requiredPermissions: Permission[],
    userPermissions: Permission[],
  ): boolean {
    // Check if user has ALL required permissions
    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }
}
