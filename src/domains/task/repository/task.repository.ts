import { Injectable } from '@nestjs/common'
import { Task, Prisma } from '@prisma/client'

import { PrismaRepository } from '@/domains/abstrations/repository/prisma/Repository'
import { PrismaService } from '@/shared/infra/prisma/prisma.service'

import { ITaskRepository } from '../interfaces/task.interface'

@Injectable()
export class TaskRepository
  extends PrismaRepository<
    Prisma.TaskFindFirstArgs,
    Prisma.TaskWhereUniqueInput,
    Prisma.TaskCreateInput,
    Prisma.TaskUpdateInput,
    Task
  >
  implements ITaskRepository
{
  constructor(private readonly repository: PrismaService) {
    super('task', repository)
  }
}
