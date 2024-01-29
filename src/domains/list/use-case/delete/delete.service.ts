import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, UserRole } from '@prisma/client'

import { validateOwnership } from '@/shared/utils/validate-ownership'

import { IListRepository } from '../../interfaces/list.interface'

@Injectable()
export class DeleteService {
  constructor(private readonly listRepository: IListRepository) {}

  public async execute({ id, userId }: Prisma.ListWhereUniqueInput, userRole: UserRole): Promise<void> {
    const result = await this.listRepository.findByUnique({ id })

    if (!result) throw new NotFoundException('Coluna não encontrada.')

    if (userRole === UserRole.USER) {
      await validateOwnership(userId as string, result.id, this.listRepository)
    }

    this.listRepository.delete({ id: result.id })
  }
}
