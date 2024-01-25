import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { User as PrismaUser } from '@prisma/client'

import { EnvironmentVariables, EnvironmentVariablesType } from '@/config/env'
import { ICryptographyProvider } from '@/shared/providers/cryptography'
import { ITokenProvider } from '@/shared/providers/token'

import { IUserRepository } from '../../interfaces/user.interface'

export type LoginServiceInput = {
  email: string
  password: string
}

export type LoginServiceOutput = {
  user: Omit<PrismaUser, 'password'>
  accessToken: string
}

@Injectable()
export class LoginService {
  constructor(
    @Inject(EnvironmentVariables.KEY)
    private readonly config: EnvironmentVariablesType,
    private readonly userRepository: IUserRepository,
    private readonly cryptographyProvider: ICryptographyProvider,
    private readonly jwtProvider: ITokenProvider,
  ) {}

  public async execute(input: LoginServiceInput): Promise<LoginServiceOutput> {
    const user = await this.userRepository.findByUnique({ email: input.email })

    if (user) {
      const isPasswordValid = await this.cryptographyProvider.compare({
        hash: user.password,
        password: input.password,
      })

      if (!isPasswordValid) {
        throw new BadRequestException('Email ou senha estão incorretos.')
      }
    } else {
      throw new BadRequestException('Email ou senha estão incorretos.')
    }

    const accessToken = await this.jwtProvider.sign({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      jwtExpiresIn: this.config.jwt.expiresIn,
      jwtSecret: this.config.jwt.secret,
    })

    delete user.password

    return {
      accessToken,
      user,
    }
  }
}
