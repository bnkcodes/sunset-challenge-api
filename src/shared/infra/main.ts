import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'

NestFactory.create(AppModule, { cors: true }).then(async (app) => {
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  SwaggerModule.setup(
    'doc/api',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder().setTitle('Documentation').setVersion('1.0').addBearerAuth().build(),
    ),
  )

  await app.listen(process.env.PORT || 3333, null, async () =>
    console.log(`Application is running on: ${await app.getUrl()}`),
  )
})
