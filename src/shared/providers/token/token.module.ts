import { Module } from '@nestjs/common'

import { JWTGateway } from './gateways/jwt.gateway'
import { ITokenProvider } from './interface/ITokenProvider'
import { TokenProvider } from './service/token.service'

@Module({
  providers: [{ provide: ITokenProvider, useClass: TokenProvider }, JWTGateway],
  exports: [{ provide: ITokenProvider, useClass: TokenProvider }, JWTGateway],
})
export class TokenModule {}
