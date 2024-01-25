import { Module } from '@nestjs/common'

import { BCryptGateway } from './gateways/bcrypt.gateway'
import { ICryptographyProvider } from './interface/ICryptographyProvider'
import { CryptographyProvider } from './service/cryptography.service'

@Module({
  providers: [{ provide: ICryptographyProvider, useClass: CryptographyProvider }, BCryptGateway],
  exports: [{ provide: ICryptographyProvider, useClass: CryptographyProvider }, BCryptGateway],
})
export class CryptographyModule {}
