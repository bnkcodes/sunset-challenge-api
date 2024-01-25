import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { IUserRepository } from '../../interfaces/user.interface'

@Injectable()
export class DeleteService {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute({ id }: Prisma.UserWhereUniqueInput): Promise<void> {
    const result = await this.userRepository.findByUnique({ id })

    if (!result) throw new NotFoundException('Usuário não encontrado.')

    this.userRepository.delete({ id })
  }
}
