import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, UserRole } from '@prisma/client'

import { validateOwnership } from '@/shared/utils/validate-ownership'

import { IColumnRepository } from '../../interfaces/column.interface'

@Injectable()
export class DeleteService {
  constructor(private readonly columnRepository: IColumnRepository) {}

  public async execute({ id, userId }: Prisma.ColumnWhereUniqueInput, userRole: UserRole): Promise<void> {
    const result = await this.columnRepository.findByUnique({ id })

    if (!result) throw new NotFoundException('Coluna não encontrada.')

    if (userRole === UserRole.USER) {
      await validateOwnership(userId as string, result.id, this.columnRepository)
    }

    this.columnRepository.delete({ id: result.id })
  }
}
