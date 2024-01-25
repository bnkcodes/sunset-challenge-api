import { Inject, Injectable } from '@nestjs/common'

import { EnvironmentVariables, EnvironmentVariablesType } from '@/config/env'

import { JWTGateway } from '../gateways/jwt.gateway'

@Injectable()
export class TokenProvider {
  constructor(
    @Inject(EnvironmentVariables.KEY)
    private readonly config: EnvironmentVariablesType,
    private readonly jWTGateway: JWTGateway,
  ) {
    const provider = {
      jwt: this.jWTGateway,
    }

    return provider[this.config.app.driver.tokenDriver]
  }
}
