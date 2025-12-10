import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { KeycloakService } from '../auth/keycloak.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  // Mock users data - replace with actual database implementation
  private users = [
    { id: '1', username: 'admin', email: 'admin@example.com', role: 'admin' },
    {
      id: '2',
      username: 'manager',
      email: 'manager@example.com',
      role: 'manager',
    },
    { id: '3', username: 'user', email: 'user@example.com', role: 'user' },
  ];

  constructor(
    private readonly keycloakService: KeycloakService,
    private prisma: PrismaService,
  ) {}

  findAll() {
    return { message: 'This action returns all users', data: this.users };
  }

  findOne(id: string) {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { message: 'User found', data: user };
  }

  async create(createUserDto: CreateUserDto) {
    try {
      // First, create user in Keycloak
      await this.keycloakService.registerUser({
        email: createUserDto.email,
        username: createUserDto.username,
        password: createUserDto.password,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        roles: createUserDto.role ? [createUserDto.role] : undefined,
      });

      // Then create user in database using Prisma
      const newUser = await this.prisma.user.create({
        data: {
          id: crypto.randomUUID(),
          username: createUserDto.username,
          email: createUserDto.email,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          role: createUserDto.role || 'viewer',
        },
      });

      return {
        message: 'User created successfully in Keycloak and database',
        data: newUser,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  update(id: string, updateUserDto: Record<string, unknown>) {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto };
    return { message: 'User updated', data: this.users[userIndex] };
  }

  remove(id: string) {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const deletedUser = this.users.splice(userIndex, 1)[0];
    return { message: 'User deleted', data: deletedUser };
  }
}
