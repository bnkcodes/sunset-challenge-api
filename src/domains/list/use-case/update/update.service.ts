import { BadRequestException, Injectable } from '@nestjs/common'
import { List, Prisma, UserRole } from '@prisma/client'

import { validateOwnership } from '@/shared/utils/validate-ownership'

import { IListRepository } from '../../interfaces/list.interface'

@Injectable()
export class UpdateService {
  constructor(private readonly listRepository: IListRepository) {}

  public async execute(
    { id, userId }: Prisma.ListWhereUniqueInput,
    input: Prisma.ListUpdateInput,
    userRole: UserRole,
  ): Promise<List | void> {
    const result = await this.listRepository.findByUnique({ id })

    if (!result) throw new BadRequestException('Coluna não encontrada.')

    if (userRole === UserRole.USER) {
      await validateOwnership(userId as string, result.id, this.listRepository)
    }

    const list = await this.listRepository.update({ id: result.id }, input)

    return list
  }
}
