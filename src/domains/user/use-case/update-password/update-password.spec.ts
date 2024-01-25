import { NotFoundException, UnauthorizedException } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { EnvironmentVariables, EnvironmentVariablesSchema } from '@/config/env'
import { PrismaService } from '@/shared/infra/prisma/prisma.service'
import { CryptographyModule, ICryptographyProvider } from '@/shared/providers/cryptography'

import { IUserRepository } from '../../interfaces/user.interface'
import { UserRepository } from '../../repository/user.repository'
import { UpdatePasswordService } from './update-password.service'

describe('User - Update password use case', () => {
  let service: UpdatePasswordService
  let userRepository: IUserRepository
  let cryptographyProvider: ICryptographyProvider

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
        CryptographyModule,
      ],

      providers: [PrismaService, { provide: IUserRepository, useClass: UserRepository }, UpdatePasswordService],
    }).compile()

    service = moduleRef.get(UpdatePasswordService)
    userRepository = moduleRef.get(IUserRepository)
    cryptographyProvider = moduleRef.get(ICryptographyProvider)
  })

  it('should return error when user not found', async () => {
    jest.spyOn(userRepository, 'findByUnique').mockResolvedValue(null)

    const result = () => service.execute({ id: 'userId' }, { oldPassword: 'pass', password: 'newPass' })
    const expected = new NotFoundException('Usuário não encontrado.')

    await expect(result).rejects.toThrow(expected)
  })

  it("should return an error when the old password doesn't match", async () => {
    jest.spyOn(userRepository, 'findByUnique').mockResolvedValue({ id: 'userId' } as any)
    jest.spyOn(cryptographyProvider, 'compare').mockResolvedValue(false)

    const result = () => service.execute({ id: 'userId' }, { oldPassword: 'pass', password: 'newPass' })
    const expected = new UnauthorizedException('Senha inválida.')

    await expect(result).rejects.toThrow(expected)
  })

  it('should return user updated with success', async () => {
    jest.spyOn(userRepository, 'findByUnique').mockResolvedValue({ id: 'userId' } as any)
    jest.spyOn(cryptographyProvider, 'compare').mockResolvedValue(true)
    jest.spyOn(cryptographyProvider, 'encrypt').mockResolvedValue('newPass')
    jest.spyOn(userRepository, 'update').mockImplementation((_, input) => input as any)

    const result = await service.execute({ id: 'userId' }, { oldPassword: 'pass', password: 'newPass' })

    expect(result).toBeUndefined()
  })
})
