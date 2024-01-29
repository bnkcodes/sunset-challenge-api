import { NotFoundException } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Test } from '@nestjs/testing'

import { EnvironmentVariables, EnvironmentVariablesSchema } from '@/config/env'
import { PrismaService } from '@/shared/infra/prisma/prisma.service'
import { IStorageProvider, StorageModule } from '@/shared/providers/storage'

import { IUserRepository } from '../../interfaces/user.interface'
import { UserRepository } from '../../repository/user.repository'
import { UploadImageService } from './upload-image.service'

describe('User - Upload image use case', () => {
  let service: UploadImageService
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
      providers: [PrismaService, { provide: IUserRepository, useClass: UserRepository }, UploadImageService],
    }).compile()

    service = moduleRef.get(UploadImageService)
    userRepository = moduleRef.get(IUserRepository)
    storageProvider = moduleRef.get(IStorageProvider)
  })

  beforeEach(async () => {
    jest.clearAllMocks()
  })

  it('should return error when user not found', async () => {
    jest.spyOn(userRepository, 'findByUnique').mockResolvedValue(null)

    const result = () => service.execute({ id: 'userId', file: {} } as any)

    const expected = new NotFoundException('Usuário não encontrado.')

    await expect(result).rejects.toThrow(expected)
  })

  it('should return upload image with succes', async () => {
    const customerOBJ = {
      email: 'email@email.com',
      id: 'customerId',
      name: 'user name',
      role: 'role',
      avatarUrl: 'avatarUrl.com',
    }

    jest.spyOn(userRepository, 'findByUnique').mockResolvedValueOnce(customerOBJ as any)
    jest.spyOn(storageProvider, 'deleteFile').mockResolvedValueOnce(null)
    jest.spyOn(storageProvider, 'saveFile').mockResolvedValueOnce({ url: 'newimage.com' })
    jest.spyOn(userRepository, 'update').mockImplementation((_, data) => data as any)

    const file = { name: 'file' }
    const result = await service.execute({ id: 'userId', file: file } as any)

    const expected = { avatarUrl: 'newimage.com' }

    expect(result).toEqual(expected)
    expect(storageProvider.deleteFile).toHaveBeenCalledWith({ path: customerOBJ.avatarUrl })
    expect(storageProvider.saveFile).toHaveBeenCalledWith({
      context: 'user',
      file,
    })
  })
})
