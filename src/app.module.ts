import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { PodcastsModule } from './podcasts/podcasts.module'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UsersModule, PodcastsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
