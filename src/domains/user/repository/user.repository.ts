import { Injectable } from '@nestjs/common'
import { User, Prisma } from '@prisma/client'

import { PrismaRepository } from '@/domains/abstrations/repository/prisma/Repository'
import { PrismaService } from '@/shared/infra/prisma/prisma.service'

import { IUserRepository } from '../interfaces/user.interface'

@Injectable()
export class UserRepository
  extends PrismaRepository<
    Prisma.UserFindFirstArgs,
    Prisma.UserWhereUniqueInput,
    Prisma.UserCreateInput,
    Prisma.UserUpdateInput,
    User
  >
  implements IUserRepository
{
  constructor(private readonly repository: PrismaService) {
    super('user', repository)
  }
}
