import { Injectable } from '@nestjs/common'
import { Prisma, Task } from '@prisma/client'

import { PaginateInterface } from '@/shared/interfaces/paginate.interface'
import { ParseSort } from '@/shared/utils/parse-sort'

import { ITaskRepository } from '../../interfaces/task.interface'

export type GetAllServiceInput = {
  filter?: {
    listId: string
    userId: string
    title?: string
  }
} & PaginateInterface

export type GetAllServiceOutput = {
  items: Task[]
} & PaginateInterface

@Injectable()
export class GetAllService {
  constructor(private readonly taskRepository: ITaskRepository) {}

  public async execute(data?: GetAllServiceInput): Promise<GetAllServiceOutput> {
    const query: Prisma.TaskWhereInput = {
      userId: data.filter.userId,
      listId: data.filter.listId,
    }

    if (data?.filter?.title) {
      query.title = {
        contains: data.filter.title,
        mode: 'insensitive',
      }
    }

    const items = await this.taskRepository.findAll({
      where: query,
      take: data.pagination.perPage,
      skip: (data.pagination.page - 1) * data.pagination.perPage,
      orderBy: new ParseSort(data.pagination.sort).object(),
    })

    data.pagination.total = await this.taskRepository.count({
      where: query,
    })

    return {
      items,
      pagination: { ...data.pagination },
    }
  }
}
