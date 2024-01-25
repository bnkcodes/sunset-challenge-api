import { BadRequestException } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Test } from '@nestjs/testing'

import { EnvironmentVariables, EnvironmentVariablesSchema } from '@/config/env'
import { PrismaService } from '@/shared/infra/prisma/prisma.service'
import { CryptographyModule, ICryptographyProvider } from '@/shared/providers/cryptography'
import { ITokenProvider, TokenModule } from '@/shared/providers/token'

import { IUserRepository } from '../../interfaces/user.interface'
import { UserRepository } from '../../repository/user.repository'
import { RegisterService } from './register.service'

describe('Auth - Register use case', () => {
  let service: RegisterService
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
      ],

      providers: [PrismaService, { provide: IUserRepository, useClass: UserRepository }, RegisterService],
    }).compile()

    service = moduleRef.get(RegisterService)
    userRepository = moduleRef.get(IUserRepository)
    cryptographyProvider = moduleRef.get(ICryptographyProvider)
    jwtProvider = moduleRef.get(ITokenProvider)
  })

  it('should return an error when the email is already taken', async () => {
    jest.spyOn(userRepository, 'findByUnique').mockResolvedValue({ email: 'email' } as any)

    const result = () => service.execute({ email: 'email' } as any)
    const expected = new BadRequestException('Email já cadastrado.')

    await expect(result).rejects.toThrow(expected)
  })

  it('should return an error when an error occurs while creating a user', async () => {
    jest.spyOn(userRepository, 'findByUnique').mockResolvedValue(null)
    jest.spyOn(cryptographyProvider, 'encrypt').mockResolvedValue('pass')
    jest.spyOn(userRepository, 'create').mockResolvedValue(null)

    const result = () => service.execute({ email: 'email' } as any)

    const expected = new BadRequestException('Erro ao realizar cadastro.')
    await expect(result).rejects.toThrow(expected)
  })

  it('should return creation and authentication successfully', async () => {
    const mockedData = {
      id: 'userId',
      email: 'userEmail',
      name: 'userName',
      role: 'userRole',
    }

    jest.spyOn(userRepository, 'findByUnique').mockResolvedValue(null)
    jest.spyOn(cryptographyProvider, 'encrypt').mockResolvedValue('pass')
    jest.spyOn(userRepository, 'create').mockResolvedValue(mockedData as any)
    jest.spyOn(jwtProvider, 'sign').mockResolvedValue('accessToken')

    const result = await service.execute(mockedData as any)

    const expected = {
      accessToken: 'accessToken',
      user: mockedData,
    }

    expect(result).toEqual(expected)
  })
})
