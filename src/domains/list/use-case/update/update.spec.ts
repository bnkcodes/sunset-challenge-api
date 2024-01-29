import { BadRequestException, ForbiddenException } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { EnvironmentVariables, EnvironmentVariablesSchema } from '@/config/env'
import { PrismaService } from '@/shared/infra/prisma/prisma.service'

import { listData } from '../_stubs'
import { IListRepository } from '../../interfaces/list.interface'
import { ListRepository } from '../../repository/list.repository'
import { UpdateService } from './update.service'

describe('List - Update use case', () => {
  let service: UpdateService
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

      providers: [PrismaService, { provide: IListRepository, useClass: ListRepository }, UpdateService],
    }).compile()

    service = moduleRef.get(UpdateService)
    listRepository = moduleRef.get(IListRepository)
  })

  it('should return error when list not found', async () => {
    jest.spyOn(listRepository, 'findByUnique').mockResolvedValue(null)

    const result = () => service.execute({ id: 'listId', userId: 'userId' }, { name: 'listName' }, 'USER')
    const expected = new BadRequestException('Coluna não encontrada.')

    await expect(result).rejects.toThrow(expected)
  })

  it('should return an error when the document does not belong to the user', async () => {
    jest.spyOn(listRepository, 'findByUnique').mockResolvedValueOnce({ id: 'listId' } as any)
    jest.spyOn(listRepository, 'findByUnique').mockResolvedValueOnce(null)

    const result = () => service.execute({ id: 'listId', userId: 'userId' }, { name: 'listName' }, 'USER')
    const expected = new ForbiddenException('Você não possui permissão para isso.')

    await expect(result).rejects.toThrow(expected)
  })

  it('should return list updated with success', async () => {
    const listStub = listData()

    jest.spyOn(listRepository, 'findByUnique').mockResolvedValue({ id: 'listId' } as any)
    jest.spyOn(listRepository, 'update').mockImplementation((_, input) => input as any)

    const result = await service.execute({ id: 'listId', userId: 'userId' }, listStub, 'USER')

    expect(result).toEqual(listStub)
  })
})
