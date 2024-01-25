import { BadRequestException, ForbiddenException } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { EnvironmentVariables, EnvironmentVariablesSchema } from '@/config/env'
import { PrismaService } from '@/shared/infra/prisma/prisma.service'

import { columnData } from '../_stubs'
import { IColumnRepository } from '../../interfaces/column.interface'
import { ColumnRepository } from '../../repository/column.repository'
import { UpdateService } from './update.service'

describe('Column - Update use case', () => {
  let service: UpdateService
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

      providers: [PrismaService, { provide: IColumnRepository, useClass: ColumnRepository }, UpdateService],
    }).compile()

    service = moduleRef.get(UpdateService)
    columnRepository = moduleRef.get(IColumnRepository)
  })

  it('should return error when column not found', async () => {
    jest.spyOn(columnRepository, 'findByUnique').mockResolvedValue(null)

    const result = () => service.execute({ id: 'columnId', userId: 'userId' }, { name: 'columnName' }, 'USER')
    const expected = new BadRequestException('Coluna não encontrada.')

    await expect(result).rejects.toThrow(expected)
  })

  it('should return an error when the document does not belong to the user', async () => {
    jest.spyOn(columnRepository, 'findByUnique').mockResolvedValueOnce({ id: 'columnId' } as any)
    jest.spyOn(columnRepository, 'findByUnique').mockResolvedValueOnce(null)

    const result = () => service.execute({ id: 'columnId', userId: 'userId' }, { name: 'columnName' }, 'USER')
    const expected = new ForbiddenException('Você não possui permissão para isso.')

    await expect(result).rejects.toThrow(expected)
  })

  it('should return column updated with success', async () => {
    const columnStub = columnData()

    jest.spyOn(columnRepository, 'findByUnique').mockResolvedValue({ id: 'columnId' } as any)
    jest.spyOn(columnRepository, 'update').mockImplementation((_, input) => input as any)

    const result = await service.execute({ id: 'columnId', userId: 'userId' }, columnStub, 'USER')

    expect(result).toEqual(columnStub)
  })
})
