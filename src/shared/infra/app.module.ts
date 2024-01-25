import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { EnvironmentVariables, EnvironmentVariablesSchema } from '../../config/env'
import { modules } from './modules'
import { providers } from './providers'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvironmentVariables],
      validationSchema: EnvironmentVariablesSchema,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    PassportModule,
    ...modules,
  ],
  controllers: [],
  providers: [...providers],
})
export class AppModule {}
