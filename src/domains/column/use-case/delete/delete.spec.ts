import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { EnvironmentVariables, EnvironmentVariablesSchema } from '@/config/env'
import { PrismaService } from '@/shared/infra/prisma/prisma.service'

import { IColumnRepository } from '../../interfaces/column.interface'
import { ColumnRepository } from '../../repository/column.repository'
import { DeleteService } from './delete.service'

describe('Column - Delete use case', () => {
  let service: DeleteService
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

      providers: [PrismaService, { provide: IColumnRepository, useClass: ColumnRepository }, DeleteService],
    }).compile()

    service = moduleRef.get(DeleteService)
    columnRepository = moduleRef.get(IColumnRepository)
  })

  it('should return an error when the column is not found', async () => {
    jest.spyOn(columnRepository, 'findByUnique').mockResolvedValue(null)

    const result = () => service.execute({ id: 'columnId' }, 'USER')
    const expected = new NotFoundException('Coluna não encontrada.')

    await expect(result).rejects.toThrow(expected)
  })

  it('should return an error when the document does not belong to the user', async () => {
    jest.spyOn(columnRepository, 'findByUnique').mockResolvedValueOnce({ id: 'columnId' } as any)
    jest.spyOn(columnRepository, 'findByUnique').mockResolvedValueOnce(null)

    const result = () => service.execute({ id: 'columnId', userId: 'userId' }, 'USER')
    const expected = new ForbiddenException('Você não possui permissão para isso.')

    await expect(result).rejects.toThrow(expected)
  })

  it('should return successful deletion', async () => {
    jest.spyOn(columnRepository, 'findByUnique').mockResolvedValue({ id: 'taskId' } as any)
    jest.spyOn(columnRepository, 'delete').mockResolvedValue()

    const result = await service.execute({ id: 'columnId', userId: 'userId' }, 'USER')

    expect(result).toBeUndefined()
  })
})
