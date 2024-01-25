import { Module } from '@nestjs/common'

import { BunnyGateway } from './gateways/bunny.gateway'
import { IStorageProvider } from './interface/IStorageProvider'
import { StorageProvider } from './service/storage.service'

@Module({
  providers: [{ provide: IStorageProvider, useClass: StorageProvider }, BunnyGateway],
  exports: [{ provide: IStorageProvider, useClass: StorageProvider }, BunnyGateway],
})
export class StorageModule {}
