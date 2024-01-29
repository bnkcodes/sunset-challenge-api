import { Injectable } from '@nestjs/common'
import { List, Prisma } from '@prisma/client'

import { PaginateInterface } from '@/shared/interfaces/paginate.interface'
import { ParseSort } from '@/shared/utils/parse-sort'

import { IListRepository } from '../../interfaces/list.interface'

export type GetAllServiceInput = {
  filter?: {
    userId: string
    name?: string
  }
} & PaginateInterface

export type GetAllServiceOutput = {
  items: List[]
} & PaginateInterface

@Injectable()
export class GetAllService {
  constructor(private readonly listRepository: IListRepository) {}

  public async execute(data?: GetAllServiceInput): Promise<GetAllServiceOutput> {
    const query: Prisma.ListWhereInput = {
      userId: data.filter.userId,
    }

    if (data?.filter?.name) {
      query.name = {
        contains: data.filter.name,
        mode: 'insensitive',
      }
    }

    const items = await this.listRepository.findAll({
      where: query,
      take: data.pagination.perPage,
      skip: (data.pagination.page - 1) * data.pagination.perPage,
      orderBy: new ParseSort(data.pagination.sort).object(),
    })

    data.pagination.total = await this.listRepository.count({
      where: query,
    })

    return {
      items,
      pagination: { ...data.pagination },
    }
  }
}
