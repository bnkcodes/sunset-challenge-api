import { ConfigType } from '@nestjs/config'

import { EnvironmentVariables } from './variables'

export type EnvironmentVariablesType = ConfigType<typeof EnvironmentVariables>
