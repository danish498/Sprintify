import { SetMetadata } from '@nestjs/common';
import { Permission } from '../interfaces';

export const PERMISSIONS_KEY = 'permissions';

/**
 * Permissions Decorator
 * Use this decorator to specify which permissions are required to access a route
 *
 * @example
 * @Permissions(Permission.USER_READ, Permission.USER_UPDATE)
 * @Get('users')
 * getUsers() {}
 */
export const Permissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
