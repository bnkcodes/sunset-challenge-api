import { Injectable } from '@nestjs/common'
import { Column, Prisma } from '@prisma/client'

import { PrismaRepository } from '@/domains/abstrations/repository/prisma/Repository'
import { PrismaService } from '@/shared/infra/prisma/prisma.service'

import { IColumnRepository } from '../interfaces/column.interface'

@Injectable()
export class ColumnRepository
  extends PrismaRepository<
    Prisma.ColumnFindFirstArgs,
    Prisma.ColumnWhereUniqueInput,
    Prisma.ColumnCreateInput,
    Prisma.ColumnUpdateInput,
    Column
  >
  implements IColumnRepository
{
  constructor(private readonly repository: PrismaService) {
    super('column', repository)
  }
}
