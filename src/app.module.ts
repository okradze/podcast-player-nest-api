import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module';
import { PodcastsModule } from './podcasts/podcasts.module';

@Module({
  imports: [UsersModule, PodcastsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
