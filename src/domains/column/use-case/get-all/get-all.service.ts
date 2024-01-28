import { Injectable } from '@nestjs/common'
import { Column, Prisma } from '@prisma/client'

import { PaginateInterface } from '@/shared/interfaces/paginate.interface'
import { ParseSort } from '@/shared/utils/parse-sort'

import { IColumnRepository } from '../../interfaces/column.interface'

export type GetAllServiceInput = {
  filter?: {
    userId: string
    name?: string
  }
} & PaginateInterface

export type GetAllServiceOutput = {
  items: Column[]
} & PaginateInterface

@Injectable()
export class GetAllService {
  constructor(private readonly columnRepository: IColumnRepository) {}

  public async execute(data?: GetAllServiceInput): Promise<GetAllServiceOutput> {
    const query: Prisma.ColumnWhereInput = {
      userId: data.filter.userId,
    }

    if (data?.filter?.name) {
      query.name = {
        contains: data.filter.name,
        mode: 'insensitive',
      }
    }

    const items = await this.columnRepository.findAll({
      where: query,
      take: data.pagination.perPage,
      skip: (data.pagination.page - 1) * data.pagination.perPage,
      orderBy: new ParseSort(data.pagination.sort).object(),
    })

    data.pagination.total = await this.columnRepository.count({
      where: query,
    })

    return {
      items,
      pagination: { ...data.pagination },
    }
  }
}
