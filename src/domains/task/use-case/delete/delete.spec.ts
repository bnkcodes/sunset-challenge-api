import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { EnvironmentVariables, EnvironmentVariablesSchema } from '@/config/env'
import { PrismaService } from '@/shared/infra/prisma/prisma.service'

import { ITaskRepository } from '../../interfaces/task.interface'
import { TaskRepository } from '../../repository/task.repository'
import { DeleteService } from './delete.service'

describe('Task - Delete use case', () => {
  let service: DeleteService
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

      providers: [PrismaService, { provide: ITaskRepository, useClass: TaskRepository }, DeleteService],
    }).compile()

    service = moduleRef.get(DeleteService)
    taskRepository = moduleRef.get(ITaskRepository)
  })

  it('should return an error when the task is not found', async () => {
    jest.spyOn(taskRepository, 'findByUnique').mockResolvedValue(null)

    const result = () => service.execute({ id: 'taskId' }, 'USER')
    const expected = new NotFoundException('Task não encontrada.')

    await expect(result).rejects.toThrow(expected)
  })

  it('should return an error when the document does not belong to the user', async () => {
    jest.spyOn(taskRepository, 'findByUnique').mockResolvedValueOnce({ id: 'taskId' } as any)
    jest.spyOn(taskRepository, 'findByUnique').mockResolvedValueOnce(null)

    const result = () => service.execute({ id: 'listId', userId: 'userId' }, 'USER')
    const expected = new ForbiddenException('Você não possui permissão para isso.')

    await expect(result).rejects.toThrow(expected)
  })

  it('should return successful deletion', async () => {
    jest.spyOn(taskRepository, 'findByUnique').mockResolvedValue({ id: 'taskId' } as any)
    jest.spyOn(taskRepository, 'delete').mockResolvedValue()

    const result = await service.execute({ id: 'taskId', userId: 'userId' }, 'USER')

    expect(result).toBeUndefined()
  })
})
