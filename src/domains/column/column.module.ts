import { Module } from '@nestjs/common'

import { PrismaService } from '@/shared/infra/prisma/prisma.service'

import { ColumnController } from './controllers/column.controller'
import { IColumnRepository } from './interfaces/column.interface'
import { ColumnRepository } from './repository/column.repository'
import { CreateService } from './use-case/create'
import { DeleteService } from './use-case/delete'
import { GetAllService } from './use-case/get-all'
import { UpdateService } from './use-case/update'

@Module({
  controllers: [ColumnController],
  providers: [
    PrismaService,
    { provide: IColumnRepository, useClass: ColumnRepository },
    GetAllService,
    CreateService,
    UpdateService,
    DeleteService,
  ],
})
export class ColumnModule {}
