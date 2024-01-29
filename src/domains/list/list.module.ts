import { Module } from '@nestjs/common'

import { PrismaService } from '@/shared/infra/prisma/prisma.service'

import { ListController } from './controllers/list.controller'
import { IListRepository } from './interfaces/list.interface'
import { ListRepository } from './repository/list.repository'
import { CreateService } from './use-case/create'
import { DeleteService } from './use-case/delete'
import { GetAllService } from './use-case/get-all'
import { UpdateService } from './use-case/update'

@Module({
  controllers: [ListController],
  providers: [
    PrismaService,
    { provide: IListRepository, useClass: ListRepository },
    GetAllService,
    CreateService,
    UpdateService,
    DeleteService,
  ],
})
export class ListModule {}
