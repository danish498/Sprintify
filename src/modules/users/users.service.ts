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
  constructor(
    private readonly keycloakService: KeycloakService,
    private prisma: PrismaService,
  ) {}

  async findAll() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });
      return { message: 'This action returns all users', data: users };
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: BigInt(id) },
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return { message: 'User found', data: user };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to fetch user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
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
          username: createUserDto.username,
          email: createUserDto.email,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          role: createUserDto.role || 'VIEWER',
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

  async update(id: string, updateUserDto: Record<string, unknown>) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { id: BigInt(id) },
      });
      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: BigInt(id) },
        data: updateUserDto,
      });
      return { message: 'User updated', data: updatedUser };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async remove(id: string) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { id: BigInt(id) },
      });
      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const deletedUser = await this.prisma.user.delete({
        where: { id: BigInt(id) },
      });
      return { message: 'User deleted', data: deletedUser };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
