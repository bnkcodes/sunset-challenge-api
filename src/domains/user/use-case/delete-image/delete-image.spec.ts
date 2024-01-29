import { NotFoundException } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Test } from '@nestjs/testing'

import { EnvironmentVariables, EnvironmentVariablesSchema } from '@/config/env'
import { PrismaService } from '@/shared/infra/prisma/prisma.service'
import { IStorageProvider, StorageModule } from '@/shared/providers/storage'

import { IUserRepository } from '../../interfaces/user.interface'
import { UserRepository } from '../../repository/user.repository'
import { DeleteImageService } from './delete-image.service'

describe('User - Delete image use case', () => {
  let service: DeleteImageService
  let userRepository: IUserRepository
  let storageProvider: IStorageProvider

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [EnvironmentVariables],
          validationSchema: EnvironmentVariablesSchema,
        }),
        StorageModule,
      ],
      providers: [PrismaService, { provide: IUserRepository, useClass: UserRepository }, DeleteImageService],
    }).compile()

    service = moduleRef.get(DeleteImageService)
    userRepository = moduleRef.get(IUserRepository)
    storageProvider = moduleRef.get(IStorageProvider)
  })

  it('should return error when user not found', async () => {
    jest.spyOn(userRepository, 'findByUnique').mockResolvedValue(null)

    const result = () => service.execute({ id: 'id' })

    const expected = new NotFoundException('Usuário não encontrado.')

    await expect(result).rejects.toThrow(expected)
  })

  it('should return delete image with success', async () => {
    const userOBJ = {
      email: 'email@email.com',
      id: 'userId',
      name: 'user name',
      role: 'role',
      avatarUrl: 'avatarUrl.com',
    }

    jest.spyOn(userRepository, 'findByUnique').mockResolvedValue(userOBJ as any)
    jest.spyOn(storageProvider, 'deleteFile').mockResolvedValue(null)

    jest.spyOn(userRepository, 'update').mockImplementation((_, data) => data as any)

    const result = await service.execute({ id: 'id' })

    expect(result).toEqual({ avatarUrl: null })
    expect(storageProvider.deleteFile).toHaveBeenCalledWith({ path: userOBJ.avatarUrl })
  })
})
