import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { EnvironmentVariables, EnvironmentVariablesSchema } from '@/config/env'
import { PrismaService } from '@/shared/infra/prisma/prisma.service'

import { ITaskRepository } from '../../interfaces/task.interface'
import { TaskRepository } from '../../repository/task.repository'
import { GetAllService } from './get-all.service'

describe('Task - Get all use case', () => {
  let service: GetAllService
  let taskRepository: ITaskRepository

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

      providers: [PrismaService, { provide: ITaskRepository, useClass: TaskRepository }, GetAllService],
    }).compile()

    service = moduleRef.get(GetAllService)
    taskRepository = moduleRef.get(ITaskRepository)
  })

  it('should return successful', async () => {
    jest.spyOn(taskRepository, 'findAll').mockResolvedValue([{ id: 'listId1' }, { id: 'listId2' }] as any)
    jest.spyOn(taskRepository, 'count').mockResolvedValue(2)

    const result = await service.execute({
      filter: { userId: 'userId', listId: 'listId' },
      pagination: { perPage: 6, page: 1, sort: 'desc' },
    })

    const expected = {
      items: [{ id: 'listId1' }, { id: 'listId2' }],
      pagination: { perPage: 6, page: 1, sort: 'desc', total: 2 },
    }

    expect(result).toEqual(expected)
  })
})
