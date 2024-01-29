import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { EnvironmentVariables, EnvironmentVariablesSchema } from '@/config/env'
import { PrismaService } from '@/shared/infra/prisma/prisma.service'

import { IListRepository } from '../../interfaces/list.interface'
import { ListRepository } from '../../repository/list.repository'
import { GetAllService } from './get-all.service'

describe('List - Get all use case', () => {
  let service: GetAllService
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

      providers: [PrismaService, { provide: IListRepository, useClass: ListRepository }, GetAllService],
    }).compile()

    service = moduleRef.get(GetAllService)
    listRepository = moduleRef.get(IListRepository)
  })

  it('should return successful', async () => {
    const expected = [{ id: 'listId1' }, { id: 'listId2' }]

    jest.spyOn(listRepository, 'findAll').mockResolvedValue(expected as any)

    const result = await service.execute({ filter: { userId: 'userId' }, pagination: { sort: 'desc' } })

    expect(result).toEqual({ items: expected })
  })
})
