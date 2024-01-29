import { Injectable } from '@nestjs/common'
import { Prisma, Task } from '@prisma/client'

import { ITaskRepository } from '../../interfaces/task.interface'

export type CreateServiceInput = {
  title: string
  listId: string
  description?: string
}

@Injectable()
export class CreateService {
  constructor(private readonly taskRepository: ITaskRepository) {}

  public async execute({ listId, ...input }: CreateServiceInput, userId: string): Promise<Task> {
    const payload: Prisma.TaskCreateInput = {
      user: {
        connect: {
          id: userId,
        },
      },
      list: {
        connect: {
          id: listId,
        },
      },
      ...input,
    }

    return await this.taskRepository.create(payload)
  }
}
