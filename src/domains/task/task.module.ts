import { Module } from '@nestjs/common'

import { PrismaService } from '@/shared/infra/prisma/prisma.service'

import { TaskController } from './controllers/task.controller'
import { ITaskRepository } from './interfaces/task.interface'
import { TaskRepository } from './repository/task.repository'
import { CreateService } from './use-case/create'
import { DeleteService } from './use-case/delete'
import { GetAllService } from './use-case/get-all'
import { UpdateService } from './use-case/update'

@Module({
  controllers: [TaskController],
  providers: [
    PrismaService,
    { provide: ITaskRepository, useClass: TaskRepository },
    GetAllService,
    CreateService,
    UpdateService,
    DeleteService,
  ],
})
export class TaskModule {}
