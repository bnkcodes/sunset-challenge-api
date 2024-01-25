import { NotFoundException, Injectable } from '@nestjs/common'
import { User, Prisma } from '@prisma/client'

import { IUserRepository } from '../../interfaces/user.interface'

@Injectable()
export class GetByUniqueService {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(input: Prisma.UserWhereUniqueInput): Promise<User> {
    const result = await this.userRepository.findByUnique(input)

    if (!result) throw new NotFoundException('Usuário não encontrado.')

    delete result.password

    return result
  }
}
