import { Column, Prisma } from '@prisma/client'

import { IPrismaRepository } from '@/domains/abstrations/repository/prisma/IRepository'

export abstract class IColumnRepository extends IPrismaRepository<
  Prisma.ColumnFindFirstArgs,
  Prisma.ColumnWhereUniqueInput,
  Prisma.ColumnCreateInput,
  Prisma.ColumnUpdateInput,
  Column
> {}
