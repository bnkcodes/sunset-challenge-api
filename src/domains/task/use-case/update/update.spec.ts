import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { EnvironmentVariables, EnvironmentVariablesSchema } from '@/config/env'
import { PrismaService } from '@/shared/infra/prisma/prisma.service'

import { taskData } from '../_stubs'
import { ITaskRepository } from '../../interfaces/task.interface'
import { TaskRepository } from '../../repository/task.repository'
import { UpdateService } from './update.service'

describe('Task - Update use case', () => {
  let service: UpdateService
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

      providers: [PrismaService, { provide: ITaskRepository, useClass: TaskRepository }, UpdateService],
    }).compile()

    service = moduleRef.get(UpdateService)
    taskRepository = moduleRef.get(ITaskRepository)
  })

  it('should return error when task not found', async () => {
    jest.spyOn(taskRepository, 'findByUnique').mockResolvedValue(null)

    const result = () => service.execute({ id: 'taskId', userId: 'userId' }, { title: 'taskTitle' }, 'USER')
    const expected = new NotFoundException('Task não encontrada.')

    await expect(result).rejects.toThrow(expected)
  })

  it('should return an error when the document does not belong to the user', async () => {
    jest.spyOn(taskRepository, 'findByUnique').mockResolvedValueOnce({ id: 'taskId' } as any)
    jest.spyOn(taskRepository, 'findByUnique').mockResolvedValueOnce(null)

    const result = () => service.execute({ id: 'taskId', userId: 'userId' }, { title: 'taskTitle' }, 'USER')
    const expected = new ForbiddenException('Você não possui permissão para isso.')

    await expect(result).rejects.toThrow(expected)
  })

  it('should return task updated with success', async () => {
    const taskStub = taskData()

    jest.spyOn(taskRepository, 'findByUnique').mockResolvedValue({ id: 'taskId' } as any)
    jest.spyOn(taskRepository, 'update').mockImplementation((_, input) => input as any)

    const result = await service.execute({ id: 'listId', userId: 'userId' }, taskStub, 'USER')

    expect(result).toEqual(taskStub)
  })
})
