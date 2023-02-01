import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './modules/auth/auth.module'
import { PodcastsModule } from './modules/podcasts/podcasts.module'
import { UsersModule } from './modules/users/users.module'
import { User } from './modules/users/user.model'
import { APP_GUARD } from '@nestjs/core'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        uri: configService.get('DATABASE_URL'),
        models: [User],
        synchronize: true,
        autoLoadModels: true,
        dialectOptions: {
          ssl: process.env.NODE_ENV === 'production' && {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 60,
    }),
    AuthModule,
    UsersModule,
    PodcastsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
