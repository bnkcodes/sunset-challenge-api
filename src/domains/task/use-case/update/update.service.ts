import { NotFoundException, Injectable } from '@nestjs/common'
import { Task, Prisma, UserRole } from '@prisma/client'

import { validateOwnership } from '@/shared/utils/validate-ownership'

import { ITaskRepository } from '../../interfaces/task.interface'

@Injectable()
export class UpdateService {
  constructor(private readonly taskRepository: ITaskRepository) {}

  public async execute(
    { id, userId }: Prisma.TaskWhereUniqueInput,
    input: Prisma.TaskUpdateInput,
    userRole: UserRole,
  ): Promise<Task | void> {
    const result = await this.taskRepository.findByUnique({ id })

    if (!result) throw new NotFoundException('Task não encontrada.')

    if (userRole === UserRole.USER) {
      await validateOwnership(userId as string, result.id, this.taskRepository)
    }

    const task = await this.taskRepository.update({ id: result.id }, input)

    return task
  }
}
