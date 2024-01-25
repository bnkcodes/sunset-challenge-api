import { Inject, Injectable } from '@nestjs/common'

import { EnvironmentVariables, EnvironmentVariablesType } from '@/config/env'

import { BunnyGateway } from '../gateways/bunny.gateway'

@Injectable()
export class StorageProvider {
  constructor(
    @Inject(EnvironmentVariables.KEY)
    private readonly config: EnvironmentVariablesType,
    private readonly bunnyGateway: BunnyGateway,
  ) {
    const provider = {
      bunny: this.bunnyGateway,
    }

    return provider[this.config.app.driver.storageDriver]
  }
}
