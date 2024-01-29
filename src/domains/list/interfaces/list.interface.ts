import { List, Prisma } from '@prisma/client'

import { IPrismaRepository } from '@/domains/abstrations/repository/prisma/IRepository'

export abstract class IListRepository extends IPrismaRepository<
  Prisma.ListFindFirstArgs,
  Prisma.ListWhereUniqueInput,
  Prisma.ListCreateInput,
  Prisma.ListUpdateInput,
  List
> {}
