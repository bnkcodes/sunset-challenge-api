import { Injectable } from '@nestjs/common'
import { Prisma, Column } from '@prisma/client'

import { IColumnRepository } from '../../interfaces/column.interface'

export type CreateServiceInput = {
  name: string
  color?: string
}

@Injectable()
export class CreateService {
  constructor(private readonly columnRepository: IColumnRepository) {}

  public async execute(input: CreateServiceInput, userId: string): Promise<Column> {
    const payload: Prisma.ColumnCreateInput = {
      ...input,
      color: input.color || '#' + Math.floor(Math.random() * 16777215).toString(16),
      user: {
        connect: {
          id: userId,
        },
      },
    }

    return await this.columnRepository.create(payload)
  }
}
