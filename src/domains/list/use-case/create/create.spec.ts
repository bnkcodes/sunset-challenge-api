import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { EnvironmentVariables, EnvironmentVariablesSchema } from '@/config/env'
import { PrismaService } from '@/shared/infra/prisma/prisma.service'

import { listData } from '../_stubs'
import { IListRepository } from '../../interfaces/list.interface'
import { ListRepository } from '../../repository/list.repository'
import { CreateService } from './create.service'

describe('List - Create use case', () => {
  let service: CreateService
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

      providers: [PrismaService, { provide: IListRepository, useClass: ListRepository }, CreateService],
    }).compile()

    service = moduleRef.get(CreateService)
    listRepository = moduleRef.get(IListRepository)
  })

  it('should return list created with success', async () => {
    const listStub = listData()

    jest.spyOn(listRepository, 'create').mockResolvedValue(listStub)

    const result = await service.execute({ name: 'listName' }, 'userId')

    expect(result).toEqual(listStub)
  })
})
