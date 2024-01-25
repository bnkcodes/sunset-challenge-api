import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { User, Prisma } from '@prisma/client'

import { EnvironmentVariables, EnvironmentVariablesType } from '@/config/env'
import { ICryptographyProvider } from '@/shared/providers/cryptography'
import { ITokenProvider } from '@/shared/providers/token'

import { IUserRepository } from '../../interfaces/user.interface'

export type RegisterOutput = {
  user: Omit<User, 'password'>
  accessToken: string
}

@Injectable()
export class RegisterService {
  constructor(
    @Inject(EnvironmentVariables.KEY)
    private readonly config: EnvironmentVariablesType,
    private readonly userRepository: IUserRepository,
    private readonly cryptographyProvider: ICryptographyProvider,
    private readonly jwtProvider: ITokenProvider,
  ) {}

  public async execute(input: Prisma.UserCreateInput): Promise<RegisterOutput> {
    RegisterService
    const userAlreadyExists = await this.userRepository.findByUnique({
      email: input.email,
    })

    if (userAlreadyExists) {
      throw new BadRequestException('Email já cadastrado.')
    }

    const user = await this.userRepository.create({
      ...input,
      password: await this.cryptographyProvider.encrypt({
        password: input.password,
      }),
    })

    if (!user) {
      throw new BadRequestException('Erro ao realizar cadastro.')
    }

    delete user.password

    const accessToken = await this.jwtProvider.sign({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      jwtExpiresIn: this.config.jwt.expiresIn,
      jwtSecret: this.config.jwt.secret,
    })

    return {
      accessToken,
      user: user,
    }
  }
}
