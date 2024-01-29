import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { EnvironmentVariables, EnvironmentVariablesSchema } from '@/config/env'
import { PrismaService } from '@/shared/infra/prisma/prisma.service'

import { IListRepository } from '../../interfaces/list.interface'
import { ListRepository } from '../../repository/list.repository'
import { DeleteService } from './delete.service'

describe('List - Delete use case', () => {
  let service: DeleteService
  let listRepository: IListRepository

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

      providers: [PrismaService, { provide: IListRepository, useClass: ListRepository }, DeleteService],
    }).compile()

    service = moduleRef.get(DeleteService)
    listRepository = moduleRef.get(IListRepository)
  })

  it('should return an error when the list is not found', async () => {
    jest.spyOn(listRepository, 'findByUnique').mockResolvedValue(null)

    const result = () => service.execute({ id: 'listId' }, 'USER')
    const expected = new NotFoundException('Coluna não encontrada.')

    await expect(result).rejects.toThrow(expected)
  })

  it('should return an error when the document does not belong to the user', async () => {
    jest.spyOn(listRepository, 'findByUnique').mockResolvedValueOnce({ id: 'listId' } as any)
    jest.spyOn(listRepository, 'findByUnique').mockResolvedValueOnce(null)

    const result = () => service.execute({ id: 'listId', userId: 'userId' }, 'USER')
    const expected = new ForbiddenException('Você não possui permissão para isso.')

    await expect(result).rejects.toThrow(expected)
  })

  it('should return successful deletion', async () => {
    jest.spyOn(listRepository, 'findByUnique').mockResolvedValue({ id: 'taskId' } as any)
    jest.spyOn(listRepository, 'delete').mockResolvedValue()

    const result = await service.execute({ id: 'listId', userId: 'userId' }, 'USER')

    expect(result).toBeUndefined()
  })
})
