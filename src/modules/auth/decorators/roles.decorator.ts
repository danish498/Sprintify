import { SetMetadata } from '@nestjs/common';
import { Role } from '../interfaces';

export const ROLES_KEY = 'roles';

/**
 * Roles Decorator
 * Use this decorator to specify which roles can access a route
 *
 * @example
 * @Roles(Role.ADMIN, Role.MANAGER)
 * @Get('admin-only')
 * getAdminData() {}
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
