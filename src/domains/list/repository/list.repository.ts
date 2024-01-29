import { Injectable } from '@nestjs/common'
import { List, Prisma } from '@prisma/client'

import { PrismaRepository } from '@/domains/abstrations/repository/prisma/Repository'
import { PrismaService } from '@/shared/infra/prisma/prisma.service'

import { IListRepository } from '../interfaces/list.interface'

@Injectable()
export class ListRepository
  extends PrismaRepository<
    Prisma.ListFindFirstArgs,
    Prisma.ListWhereUniqueInput,
    Prisma.ListCreateInput,
    Prisma.ListUpdateInput,
    List
  >
  implements IListRepository
{
  constructor(private readonly repository: PrismaService) {
    super('list', repository)
  }
}
