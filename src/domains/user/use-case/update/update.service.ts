import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { User, Prisma } from '@prisma/client'

import { IUserRepository } from '../../interfaces/user.interface'

@Injectable()
export class UpdateService {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute({ id }: Prisma.UserWhereUniqueInput, input: Prisma.UserUpdateInput): Promise<User | void> {
    const result = await this.userRepository.findByUnique({ id })

    if (!result) throw new NotFoundException('Usuário não encontrado.')

    if (input.email) {
      const emailExists = await this.userRepository.findByUnique({
        email: input.email as string,
      })

      if (emailExists && emailExists.id !== result.id) {
        throw new BadRequestException('Email já cadastrado.')
      }
    }

    const user = await this.userRepository.update({ id: result.id }, input)

    if (user) delete user.password

    return user
  }
}
