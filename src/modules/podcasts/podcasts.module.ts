import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpModule } from '@nestjs/axios'
import { ListenNotesService } from './listenNotes.service'
import { PodcastsController } from './podcasts.controller'
import { PodcastsService } from './podcasts.service'
import { SequelizeModule } from '@nestjs/sequelize'
import { Podcast } from './models/podcast.model'
import { FavoritePodcast } from './models/favorite-podcast.model'

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        baseURL: 'https://listen-api.listennotes.com/api/v2',
        headers: {
          'X-ListenAPI-Key': configService.get('LISTEN_NOTES_API_KEY'),
        },
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([Podcast, FavoritePodcast]),
  ],
  controllers: [PodcastsController],
  providers: [PodcastsService, ListenNotesService],
})
export class PodcastsModule {}
