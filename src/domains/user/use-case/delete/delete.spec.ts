import { NotFoundException } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { EnvironmentVariables, EnvironmentVariablesSchema } from '@/config/env'
import { PrismaService } from '@/shared/infra/prisma/prisma.service'

import { IUserRepository } from '../../interfaces/user.interface'
import { UserRepository } from '../../repository/user.repository'
import { DeleteService } from './delete.service'

describe('User - Delete use case', () => {
  let service: DeleteService
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

      providers: [PrismaService, { provide: IUserRepository, useClass: UserRepository }, DeleteService],
    }).compile()

    service = moduleRef.get(DeleteService)
    userRepository = moduleRef.get(IUserRepository)
  })

  it('should return an error when the user is not found', async () => {
    jest.spyOn(userRepository, 'findByUnique').mockResolvedValue(null)

    const result = () => service.execute({ id: 'userId' })
    const expected = new NotFoundException('Usuário não encontrado.')

    await expect(result).rejects.toThrow(expected)
  })

  it('should return successful deletion', async () => {
    jest.spyOn(userRepository, 'findByUnique').mockResolvedValue({ id: 'userId' } as any)
    jest.spyOn(userRepository, 'delete').mockResolvedValue()

    const result = await service.execute({ id: 'userId' })

    expect(result).toBeUndefined()
  })
})
