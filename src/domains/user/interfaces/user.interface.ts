import { User, Prisma } from '@prisma/client'

import { IPrismaRepository } from '@/domains/abstrations/repository/prisma/IRepository'

export abstract class IUserRepository extends IPrismaRepository<
  Prisma.UserFindFirstArgs,
  Prisma.UserWhereUniqueInput,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput,
  User
> {}
