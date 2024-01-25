import { BadRequestException, Injectable } from '@nestjs/common'
import { Column, Prisma, UserRole } from '@prisma/client'

import { validateOwnership } from '@/shared/utils/validate-ownership'

import { IColumnRepository } from '../../interfaces/column.interface'

@Injectable()
export class UpdateService {
  constructor(private readonly columnRepository: IColumnRepository) {}

  public async execute(
    { id, userId }: Prisma.ColumnWhereUniqueInput,
    input: Prisma.ColumnUpdateInput,
    userRole: UserRole,
  ): Promise<Column | void> {
    const result = await this.columnRepository.findByUnique({ id })

    if (!result) throw new BadRequestException('Coluna não encontrada.')

    if (userRole === UserRole.USER) {
      await validateOwnership(userId as string, result.id, this.columnRepository)
    }

    const column = await this.columnRepository.update({ id: result.id }, input)

    return column
  }
}
