import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { QueueService } from './queue.service';
import { Roles, Permissions, Public, CurrentUser } from '../auth/decorators';
import { Role, Permission } from '../auth/interfaces';
import type { AuthenticatedUser } from '../auth/interfaces';

@ApiTags('Queue')
@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get queue status (Public)' })
  @ApiResponse({ status: 200, description: 'Queue status' })
  getQueue() {
    return this.queueService.getQueue();
  }

  @Get('all')
  @Roles(Role.MANAGER, Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all queues (Manager/Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all queues' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient roles' })
  getAllQueues() {
    return this.queueService.getAllQueues();
  }

  @Post('join')
  @Permissions(Permission.QUEUE_CREATE)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Join a queue' })
  @ApiResponse({ status: 201, description: 'Successfully joined queue' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  joinQueue(
    @CurrentUser() user: AuthenticatedUser,
    @Body() joinQueueDto: Record<string, unknown>,
  ) {
    return this.queueService.joinQueue(user.id, joinQueueDto);
  }

  @Put(':id')
  @Roles(Role.MANAGER, Role.ADMIN)
  @Permissions(Permission.QUEUE_UPDATE)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update queue (Manager/Admin only)' })
  @ApiResponse({ status: 200, description: 'Queue updated' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient roles' })
  updateQueue(
    @Param('id') id: string,
    @Body() updateQueueDto: Record<string, unknown>,
  ) {
    return this.queueService.updateQueue(id, updateQueueDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @Permissions(Permission.QUEUE_DELETE)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete queue (Admin only)' })
  @ApiResponse({ status: 200, description: 'Queue deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  deleteQueue(@Param('id') id: string) {
    return this.queueService.deleteQueue(id);
  }

  @Post(':id/manage')
  @Roles(Role.MANAGER, Role.ADMIN)
  @Permissions(Permission.QUEUE_MANAGE)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Manage queue operations (Manager/Admin only)' })
  @ApiResponse({ status: 200, description: 'Queue operation completed' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient roles' })
  manageQueue(
    @Param('id') id: string,
    @Body() operationDto: Record<string, unknown>,
  ) {
    return this.queueService.manageQueue(id, operationDto);
  }
}
