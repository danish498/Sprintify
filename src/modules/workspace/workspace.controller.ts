import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Permission, Role, Roles } from '../auth';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';

@ApiTags('Workspace')
@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER)
  findAll() {
    return this.workspaceService.findAll();
  }

  @Post()
  @Roles(Role.ADMIN)
  // @Permissions(Permission.USER_CREATE)
  create(@Body() createWorkspaceDto: CreateWorkspaceDto, @Req() req: any) {
    const ownerId = req.user.id; 
    return this.workspaceService.create(createWorkspaceDto, ownerId);
  }
}
