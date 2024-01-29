import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Task, UserRole } from '@prisma/client'

import { Authenticated } from '@/shared/decorators/authenticated.decorator'
import { Role } from '@/shared/decorators/roles.decorator'
import { AuthenticatedPayload } from '@/shared/types/payload-jwt'

import { CreateService } from '../use-case/create'
import { DeleteService } from '../use-case/delete'
import { GetAllService, GetAllServiceOutput } from '../use-case/get-all/get-all.service'
import { UpdateService } from '../use-case/update'
import { CreateTaskDTO, CreateTaskResponseDTO } from './dto/create-task.dto'
import { GetAllListResponseDTO, GetAllTaskDTO } from './dto/get-all-task.dto'
import { UpdateTaskDTO, UpdateTaskResponseDTO } from './dto/update-task.dto'

@ApiBearerAuth()
@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
  constructor(
    private readonly updateService: UpdateService,
    private readonly deleteService: DeleteService,
    private readonly createService: CreateService,
    private readonly getAllService: GetAllService,
  ) {}

  @Post()
  @Role(UserRole.USER)
  @ApiOperation({ summary: 'Create task for a list' })
  @ApiResponse({ status: 201, type: CreateTaskResponseDTO })
  public async register(
    @Body() createTaskDTO: CreateTaskDTO,
    @Authenticated() user: AuthenticatedPayload,
  ): Promise<Task> {
    return this.createService.execute(createTaskDTO, user.id)
  }

  @Get()
  @Role(UserRole.USER)
  @ApiOperation({ summary: 'Get all task of a list' })
  @ApiResponse({ status: 200, type: GetAllListResponseDTO })
  public async find(
    @Query() query: GetAllTaskDTO,
    @Authenticated() user: AuthenticatedPayload,
  ): Promise<GetAllServiceOutput> {
    return this.getAllService.execute({
      filter: {
        userId: user.id,
        listId: query.listId,
        title: query.title,
      },
      pagination: {
        perPage: +query.perPage || 6,
        page: +query.page || 1,
        sort: query.sort,
      },
    })
  }

  @Put(':id')
  @Role(UserRole.USER)
  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiResponse({ status: 200, type: UpdateTaskResponseDTO })
  public async update(
    @Param('id') id: string,
    @Body() updateTaskDTO: UpdateTaskDTO,
    @Authenticated() user: AuthenticatedPayload,
  ): Promise<Task | void> {
    return this.updateService.execute({ id, userId: user.id }, updateTaskDTO, user.role)
  }

  @Patch(':id/undone')
  @Role(UserRole.USER)
  @ApiOperation({ summary: 'Undone a task by ID' })
  @ApiResponse({ status: 200, type: UpdateTaskResponseDTO })
  public async disable(@Param('id') id: string, @Authenticated() user: AuthenticatedPayload): Promise<Task | void> {
    return this.updateService.execute(
      { id, userId: user.id },
      {
        isCompleted: false,
      },
      user.role,
    )
  }

  @Patch(':id/done')
  @Role(UserRole.USER)
  @ApiOperation({ summary: 'Done a task by ID' })
  @ApiResponse({ status: 200, type: UpdateTaskResponseDTO })
  public async enable(@Param('id') id: string, @Authenticated() user: AuthenticatedPayload): Promise<Task | void> {
    return this.updateService.execute(
      { id, userId: user.id },
      {
        isCompleted: true,
      },
      user.role,
    )
  }

  @Delete(':id')
  @Role(UserRole.USER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task by ID' })
  public async delete(@Param('id') id: string, @Authenticated() user: AuthenticatedPayload): Promise<void> {
    return this.deleteService.execute({ id, userId: user.id }, user.role)
  }
}
