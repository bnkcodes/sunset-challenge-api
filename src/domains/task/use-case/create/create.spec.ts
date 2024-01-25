import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { EnvironmentVariables, EnvironmentVariablesSchema } from '@/config/env'
import { PrismaService } from '@/shared/infra/prisma/prisma.service'

import { taskData } from '../_stubs'
import { ITaskRepository } from '../../interfaces/task.interface'
import { TaskRepository } from '../../repository/task.repository'
import { CreateService } from './create.service'

describe('Task - Create use case', () => {
  let service: CreateService
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

      providers: [PrismaService, { provide: ITaskRepository, useClass: TaskRepository }, CreateService],
    }).compile()

    service = moduleRef.get(CreateService)
    taskRepository = moduleRef.get(ITaskRepository)
  })

  it('should return task created with success', async () => {
    const taskStub = taskData()

    jest.spyOn(taskRepository, 'create').mockResolvedValue(taskStub)

    const result = await service.execute({ title: 'taskTitle', columnId: 'columnId' }, 'userId')

    expect(result).toEqual(taskStub)
  })
})
