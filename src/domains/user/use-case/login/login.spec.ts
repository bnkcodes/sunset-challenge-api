import { BadRequestException } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Test } from '@nestjs/testing'

import { EnvironmentVariables, EnvironmentVariablesSchema } from '@/config/env'
import { PrismaService } from '@/shared/infra/prisma/prisma.service'
import { CryptographyModule, ICryptographyProvider } from '@/shared/providers/cryptography'
import { StorageModule } from '@/shared/providers/storage'
import { ITokenProvider, TokenModule } from '@/shared/providers/token'

import { IUserRepository } from '../../interfaces/user.interface'
import { UserRepository } from '../../repository/user.repository'
import { LoginService } from './login.service'

describe('Auth - Login use case', () => {
  let service: LoginService
  let userRepository: IUserRepository
  let cryptographyProvider: ICryptographyProvider
  let jwtProvider: ITokenProvider

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [EnvironmentVariables],
          validationSchema: EnvironmentVariablesSchema,
        }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
        }),
        PassportModule,
        CryptographyModule,
        TokenModule,
        StorageModule,
      ],

      providers: [PrismaService, { provide: IUserRepository, useClass: UserRepository }, LoginService],
    }).compile()

    service = moduleRef.get(LoginService)
    userRepository = moduleRef.get(IUserRepository)
    cryptographyProvider = moduleRef.get(ICryptographyProvider)
    jwtProvider = moduleRef.get(ITokenProvider)
  })

  it('should return an error when the email or password is incorrect', async () => {
    jest.spyOn(userRepository, 'findByUnique').mockResolvedValue()
    jest.spyOn(cryptographyProvider, 'compare').mockResolvedValue(false)

    const result = () => service.execute({ email: 'email', password: 'pass' })
    const expected = new BadRequestException('Email ou senha estão incorretos.')

    await expect(result).rejects.toThrow(expected)
  })

  it('should return error when user not found', async () => {
    jest.spyOn(userRepository, 'findByUnique').mockResolvedValue(null)

    const result = () => service.execute({ email: 'email', password: 'pass' })
    const expected = new BadRequestException('Email ou senha estão incorretos.')

    await expect(result).rejects.toThrow(expected)
  })

  it('should return authentication successfully', async () => {
    jest.spyOn(userRepository, 'findByUnique').mockResolvedValue({
      id: 'userId',
      email: 'userEmail',
      name: 'userName',
      role: 'userRole',
    } as any)

    jest.spyOn(jwtProvider, 'sign').mockResolvedValue('accessToken')
    jest.spyOn(cryptographyProvider, 'compare').mockResolvedValue(true)

    const result = await service.execute({ email: 'email', password: 'pass' })

    const expected = {
      accessToken: 'accessToken',
      user: {
        id: 'userId',
        email: 'userEmail',
        name: 'userName',
        role: 'userRole',
      },
    }

    expect(result).toEqual(expected)
  })
})
