import { Injectable } from '@nestjs/common'
import { Prisma, List } from '@prisma/client'

import { IListRepository } from '../../interfaces/list.interface'

export type CreateServiceInput = {
  name: string
  color?: string
}

@Injectable()
export class CreateService {
  constructor(private readonly listRepository: IListRepository) {}

  public async execute(input: CreateServiceInput, userId: string): Promise<List> {
    const payload: Prisma.ListCreateInput = {
      ...input,
      color: input.color || '#' + Math.floor(Math.random() * 16777215).toString(16),
      user: {
        connect: {
          id: userId,
        },
      },
    }

    return await this.listRepository.create(payload)
  }
}
