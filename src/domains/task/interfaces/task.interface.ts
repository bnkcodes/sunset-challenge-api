import { Task, Prisma } from '@prisma/client'

import { IPrismaRepository } from '@/domains/abstrations/repository/prisma/IRepository'

export abstract class ITaskRepository extends IPrismaRepository<
  Prisma.TaskFindFirstArgs,
  Prisma.TaskWhereUniqueInput,
  Prisma.TaskCreateInput,
  Prisma.TaskUpdateInput,
  Task
> {}
