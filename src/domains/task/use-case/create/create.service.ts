import { Injectable } from '@nestjs/common'
import { Prisma, Task } from '@prisma/client'

import { ITaskRepository } from '../../interfaces/task.interface'

export type CreateServiceInput = {
  title: string
  columnId: string
  description?: string
}

@Injectable()
export class CreateService {
  constructor(private readonly taskRepository: ITaskRepository) {}

  public async execute({ columnId, ...input }: CreateServiceInput, userId: string): Promise<Task> {
    const payload: Prisma.TaskCreateInput = {
      user: {
        connect: {
          id: userId,
        },
      },
      column: {
        connect: {
          id: columnId,
        },
      },
      ...input,
    }

    return await this.taskRepository.create(payload)
  }
}
