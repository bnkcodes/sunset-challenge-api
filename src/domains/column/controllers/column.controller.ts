import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Column, UserRole } from '@prisma/client'

import { Authenticated } from '@/shared/decorators/authenticated.decorator'
import { Role } from '@/shared/decorators/roles.decorator'
import { AuthenticatedPayload } from '@/shared/types/payload-jwt'

import { CreateService } from '../use-case/create'
import { DeleteService } from '../use-case/delete'
import { GetAllService, GetAllServiceOutput } from '../use-case/get-all/get-all.service'
import { UpdateService } from '../use-case/update'
import { CreateDTO } from './dto/create.dto'
import { GetAllDTO } from './dto/get-all.dto'
import { UpdateDTO } from './dto/update.dto'

@ApiTags('Columns')
@Controller('columns')
export class ColumnController {
  constructor(
    private readonly updateService: UpdateService,
    private readonly deleteService: DeleteService,
    private readonly createService: CreateService,
    private readonly getAllService: GetAllService,
  ) {}

  @Role(UserRole.USER)
  @Post()
  @ApiOperation({ summary: 'Create' })
  public async register(@Body() body: CreateDTO, @Authenticated() user: AuthenticatedPayload): Promise<Column> {
    return this.createService.execute(body, user.id)
  }

  @Role(UserRole.USER)
  @Get()
  @ApiOperation({ summary: 'Get all' })
  public async find(
    @Query() query: GetAllDTO,
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
  @ApiOperation({ summary: 'Update' })
  public async update(
    @Param('id') id: string,
    @Body() body: UpdateDTO,
    @Authenticated() user: AuthenticatedPayload,
  ): Promise<Column | void> {
    return this.updateService.execute({ id, userId: user.id }, body, user.role)
  }

  @Role(UserRole.USER)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete' })
  public async delete(@Param('id') id: string, @Authenticated() user: AuthenticatedPayload): Promise<void> {
    return this.deleteService.execute({ id, userId: user.id }, user.role)
  }
}
