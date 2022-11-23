import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: 'http://localhost:3000',
  })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  await app.listen(8000)
}
bootstrap()
