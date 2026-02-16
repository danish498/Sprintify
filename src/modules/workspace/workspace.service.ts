import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    try {
      const workspace = this.prisma.workspace.findMany({});

      return { message: 'This action returns all workspace', data: workspace };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to fetch user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async create(workspaceDto: CreateWorkspaceDto, ownerId: number) {
    try {
      const newWorkspace = await this.prisma.workspace.create({
        data: {
          name: workspaceDto.name,
          slug: workspaceDto.slug,
          description: workspaceDto.description,
          ownerId,
        },
      });

      return {
        message: 'workspace created successfully',
        data: newWorkspace,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException(`Failed to create workspace`);
    }
  }
}
