import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { EnvironmentVariables, EnvironmentVariablesSchema } from '@/config/env'
import { PrismaService } from '@/shared/infra/prisma/prisma.service'

import { columnData } from '../_stubs'
import { IColumnRepository } from '../../interfaces/column.interface'
import { ColumnRepository } from '../../repository/column.repository'
import { CreateService } from './create.service'

describe('Column - Create use case', () => {
  let service: CreateService
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

      providers: [PrismaService, { provide: IColumnRepository, useClass: ColumnRepository }, CreateService],
    }).compile()

    service = moduleRef.get(CreateService)
    columnRepository = moduleRef.get(IColumnRepository)
  })

  it('should return column created with success', async () => {
    const columnStub = columnData()

    jest.spyOn(columnRepository, 'create').mockResolvedValue(columnStub)

    const result = await service.execute({ name: 'columnName' }, 'userId')

    expect(result).toEqual(columnStub)
  })
})
