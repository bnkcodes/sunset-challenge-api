import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { EnvironmentVariables, EnvironmentVariablesSchema } from '@/config/env'
import { PrismaService } from '@/shared/infra/prisma/prisma.service'

import { IColumnRepository } from '../../interfaces/column.interface'
import { ColumnRepository } from '../../repository/column.repository'
import { GetAllService } from './get-all.service'

describe('Column - Get all use case', () => {
  let service: GetAllService
  let columnRepository: IColumnRepository

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

      providers: [PrismaService, { provide: IColumnRepository, useClass: ColumnRepository }, GetAllService],
    }).compile()

    service = moduleRef.get(GetAllService)
    columnRepository = moduleRef.get(IColumnRepository)
  })

  it('should return successful', async () => {
    const expected = [{ id: 'columnId1' }, { id: 'columnId2' }]

    jest.spyOn(columnRepository, 'findAll').mockResolvedValue(expected as any)

    const result = await service.execute({ filter: { userId: 'userId' }, pagination: { sort: 'desc' } })

    expect(result).toEqual({ items: expected })
  })
})
