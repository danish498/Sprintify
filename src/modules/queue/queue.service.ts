import { Injectable, NotFoundException } from '@nestjs/common';

export interface QueueItem {
  id: string;
  userId: string;
  position: number;
  joinedAt: Date;
  status: string;
}

export interface Queue {
  id: string;
  name: string;
  status: string;
  items: QueueItem[];
}

@Injectable()
export class QueueService {
  // Mock queue data - replace with actual database implementation
  private queues: Queue[] = [
    {
      id: '1',
      name: 'Main Queue',
      status: 'active',
      items: [],
    },
    {
      id: '2',
      name: 'VIP Queue',
      status: 'active',
      items: [],
    },
  ];

  getQueue() {
    return {
      message: 'Queue management service',
      data: {
        totalQueues: this.queues.length,
        activeQueues: this.queues.filter((q) => q.status === 'active').length,
      },
    };
  }

  getAllQueues() {
    return {
      message: 'All queues retrieved',
      data: this.queues,
    };
  }

  joinQueue(userId: string, joinQueueDto: Record<string, unknown>) {
    const queueId = (joinQueueDto.queueId as string) || '1';
    const queue = this.queues.find((q) => q.id === queueId);

    if (!queue) {
      throw new NotFoundException(`Queue with ID ${queueId} not found`);
    }

    const newItem: QueueItem = {
      id: String(queue.items.length + 1),
      userId,
      position: queue.items.length + 1,
      joinedAt: new Date(),
      status: 'waiting',
    };

    queue.items.push(newItem);

    return {
      message: 'Successfully joined queue',
      data: {
        queueId: queue.id,
        queueName: queue.name,
        position: newItem.position,
        estimatedWait: `${newItem.position * 5} minutes`,
      },
    };
  }

  updateQueue(id: string, updateQueueDto: Record<string, unknown>) {
    const queueIndex = this.queues.findIndex((q) => q.id === id);

    if (queueIndex === -1) {
      throw new NotFoundException(`Queue with ID ${id} not found`);
    }

    this.queues[queueIndex] = {
      ...this.queues[queueIndex],
      ...updateQueueDto,
    } as Queue;

    return {
      message: 'Queue updated',
      data: this.queues[queueIndex],
    };
  }

  deleteQueue(id: string) {
    const queueIndex = this.queues.findIndex((q) => q.id === id);

    if (queueIndex === -1) {
      throw new NotFoundException(`Queue with ID ${id} not found`);
    }

    const deletedQueue = this.queues.splice(queueIndex, 1)[0];

    return {
      message: 'Queue deleted',
      data: deletedQueue,
    };
  }

  manageQueue(id: string, operationDto: Record<string, unknown>) {
    const queue = this.queues.find((q) => q.id === id);

    if (!queue) {
      throw new NotFoundException(`Queue with ID ${id} not found`);
    }

    const operation = operationDto.operation as string;

    switch (operation) {
      case 'clear':
        queue.items = [];
        return { message: 'Queue cleared', data: queue };

      case 'pause':
        queue.status = 'paused';
        return { message: 'Queue paused', data: queue };

      case 'resume':
        queue.status = 'active';
        return { message: 'Queue resumed', data: queue };

      case 'next':
        if (queue.items.length > 0) {
          const nextItem = queue.items.shift();
          queue.items.forEach((item, index) => {
            item.position = index + 1;
          });
          return { message: 'Next in queue processed', data: nextItem };
        }
        return { message: 'Queue is empty', data: null };

      default:
        return { message: 'Unknown operation', data: null };
    }
  }
}
