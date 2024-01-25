import { BadRequestException, NotFoundException } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { EnvironmentVariables, EnvironmentVariablesSchema } from '@/config/env'
import { PrismaService } from '@/shared/infra/prisma/prisma.service'

import { userData } from '../_stubs'
import { IUserRepository } from '../../interfaces/user.interface'
import { UserRepository } from '../../repository/user.repository'
import { UpdateService } from './update.service'

describe('User - Update use case', () => {
  let service: UpdateService
  let userRepository: IUserRepository

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
      ],

      providers: [PrismaService, { provide: IUserRepository, useClass: UserRepository }, UpdateService],
    }).compile()

    service = moduleRef.get(UpdateService)
    userRepository = moduleRef.get(IUserRepository)
  })

  it('should return error when user not found', async () => {
    jest.spyOn(userRepository, 'findByUnique').mockResolvedValue(null)

    const result = () => service.execute({ id: 'userId' }, { name: 'userName' })
    const expected = new NotFoundException('Usuário não encontrado.')

    await expect(result).rejects.toThrow(expected)
  })

  it('should return an error when the email is already taken', async () => {
    jest.spyOn(userRepository, 'findByUnique').mockResolvedValueOnce({ id: 'userId' } as any)
    jest.spyOn(userRepository, 'findByUnique').mockResolvedValueOnce({ email: 'email' } as any)

    const result = () => service.execute({ id: 'userId' }, { email: 'userEmail' })
    const expected = new BadRequestException('Email já cadastrado.')

    await expect(result).rejects.toThrow(expected)
  })

  it('should return user updated with success', async () => {
    const userStub = userData()

    jest.spyOn(userRepository, 'findByUnique').mockResolvedValueOnce({ id: 'userId' } as any)
    jest.spyOn(userRepository, 'findByUnique').mockResolvedValueOnce(null)
    jest.spyOn(userRepository, 'update').mockImplementation((_, input) => input as any)

    const result = await service.execute({ id: 'userId' }, userStub)

    expect(result).toEqual(userStub)
  })
})
