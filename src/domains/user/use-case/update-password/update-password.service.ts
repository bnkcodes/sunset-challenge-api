import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { ICryptographyProvider } from '@/shared/providers/cryptography'

import { IUserRepository } from '../../interfaces/user.interface'

export type UpdatePasswordInput = {
  password: string
  oldPassword?: string
  skipPasswordValidation?: boolean
}

@Injectable()
export class UpdatePasswordService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly cryptographyProvider: ICryptographyProvider,
  ) {}

  public async execute(
    { id }: Prisma.UserWhereUniqueInput,
    { oldPassword = null, password, skipPasswordValidation }: UpdatePasswordInput,
  ): Promise<void> {
    const result = await this.userRepository.findByUnique({ id })

    if (!result) throw new NotFoundException('Usuário não encontrado.')

    if (!skipPasswordValidation) {
      const matchPassword = await this.cryptographyProvider.compare({
        password: oldPassword,
        hash: result.password,
      })

      if (!matchPassword) {
        throw new UnauthorizedException('Senha inválida.')
      }
    }

    await this.userRepository.update(
      { id: result.id },
      {
        password: await this.cryptographyProvider.encrypt({ password }),
      },
    )
  }
}
