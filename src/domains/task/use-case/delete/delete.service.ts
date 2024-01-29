import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, UserRole } from '@prisma/client'

import { validateOwnership } from '@/shared/utils/validate-ownership'

import { ITaskRepository } from '../../interfaces/task.interface'

@Injectable()
export class DeleteService {
  constructor(private readonly taskRepository: ITaskRepository) {}

  public async execute({ id, userId }: Prisma.ListWhereUniqueInput, userRole: UserRole): Promise<void> {
    const result = await this.taskRepository.findByUnique({ id })

    if (!result) throw new NotFoundException('Task não encontrada.')

    if (userRole === UserRole.USER) {
      await validateOwnership(userId as string, result.id, this.taskRepository)
    }

    this.taskRepository.delete({ id: result.id })
  }
}
