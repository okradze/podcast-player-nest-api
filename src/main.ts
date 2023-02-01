import { NestFactory } from '@nestjs/core'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import helmet from 'helmet'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

const ORIGIN =
  process.env.NODE_ENV === 'production'
    ? 'https://okradze-podcasts.netlify.app'
    : 'http://localhost:3000'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(helmet())

  app.use(cookieParser())

  app.enableCors({
    origin: ORIGIN,
  })

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  })

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  await app.listen(process.env.PORT || 8000)
}
bootstrap()
