import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { List, UserRole } from '@prisma/client'

import { Authenticated } from '@/shared/decorators/authenticated.decorator'
import { Role } from '@/shared/decorators/roles.decorator'
import { AuthenticatedPayload } from '@/shared/types/payload-jwt'

import { CreateService } from '../use-case/create'
import { DeleteService } from '../use-case/delete'
import { GetAllService, GetAllServiceOutput } from '../use-case/get-all/get-all.service'
import { UpdateService } from '../use-case/update'
import { CreateListDTO, CreateListResponseDTO } from './dto/create-list.dto'
import { GetAllListDTO, GetAllListResponseDTO } from './dto/get-all-list.dto'
import { UpdateListDTO, UpdateListResponseDTO } from './dto/update-list.dto'

@ApiTags('Lists')
@Controller('lists')
export class ListController {
  constructor(
    private readonly updateService: UpdateService,
    private readonly deleteService: DeleteService,
    private readonly createService: CreateService,
    private readonly getAllService: GetAllService,
  ) {}

  @Role(UserRole.USER)
  @Post()
  @ApiOperation({ summary: 'Create a list' })
  @ApiResponse({ status: 201, type: CreateListResponseDTO })
  public async register(
    @Body() createListDTO: CreateListDTO,
    @Authenticated() user: AuthenticatedPayload,
  ): Promise<List> {
    return this.createService.execute(createListDTO, user.id)
  }

  @Role(UserRole.USER)
  @Get()
  @ApiOperation({ summary: 'Get all authenticated user lists' })
  @ApiResponse({ status: 200, type: GetAllListResponseDTO })
  public async find(
    @Query() query: GetAllListDTO,
    @Authenticated() user: AuthenticatedPayload,
  ): Promise<GetAllServiceOutput> {
    return this.getAllService.execute({
      filter: {
        userId: user.id,
        name: query.name,
      },
      pagination: {
        perPage: +query.perPage || 9,
        page: +query.page || 1,
        sort: query.sort,
      },
    })
  }

  @Role(UserRole.USER)
  @Put(':id')
  @ApiOperation({ summary: 'Update a list by ID' })
  @ApiResponse({ status: 200, type: UpdateListResponseDTO })
  public async update(
    @Param('id') id: string,
    @Body() updateListDTO: UpdateListDTO,
    @Authenticated() user: AuthenticatedPayload,
  ): Promise<List | void> {
    return this.updateService.execute({ id, userId: user.id }, updateListDTO, user.role)
  }

  @Role(UserRole.USER)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a list by ID' })
  public async delete(@Param('id') id: string, @Authenticated() user: AuthenticatedPayload): Promise<void> {
    return this.deleteService.execute({ id, userId: user.id }, user.role)
  }
}
