import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { FavoritePodcast } from './models/favorite-podcast.model'
import { Podcast } from './models/podcast.model'
import {
  IBestPodcasts,
  ICuratedPodcasts,
  ListenNotesService,
} from './listenNotes.service'
import { transformFavorites } from './podcasts.utils'

@Injectable()
export class PodcastsService {
  constructor(
    @InjectModel(Podcast) private readonly podcastModel: typeof Podcast,
    @InjectModel(FavoritePodcast)
    private readonly favoritePodcastModel: typeof FavoritePodcast,
    private readonly listenNotesService: ListenNotesService,
  ) {}

  async getBestPodcasts(
    page: string,
    userId: number | undefined,
  ): Promise<IBestPodcasts> {
    const data = await this.listenNotesService.getBestPodcasts(page)

    data.podcasts = await Promise.all(
      data.podcasts.map(async podcast => {
        if (userId) {
          const favoritePodcast = await this.favoritePodcastModel.findOne({
            where: { podcastId: podcast.id, userId },
          })
          podcast.isFavorite = !!favoritePodcast
        }
        return podcast
      }),
    )

    return data
  }

  async getCuratedPodcasts(
    page: string,
    userId: number | undefined,
  ): Promise<ICuratedPodcasts> {
    const data = await this.listenNotesService.getCuratedPodcasts(page)
    return data
  }

  async getFavorites(userId: number) {
    const favorites = await this.favoritePodcastModel.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      include: Podcast,
    })

    return transformFavorites(favorites)
  }

  async addToFavorites(userId: number, podcastId: string) {
    const podcast = await this.podcastModel.findByPk(podcastId)
    const favoritePodcast = await this.favoritePodcastModel.findOne({
      where: { userId, podcastId },
    })

    if (favoritePodcast) throw new BadRequestException('Podcast is already in favorites')

    if (!podcast) {
      const { id, title, publisher, thumbnail } =
        await this.listenNotesService.getPodcast(podcastId)

      await this.podcastModel.create({ id, title, thumbnail, publisher })
    }

    return this.favoritePodcastModel.create({ userId, podcastId })
  }

  async removeFromFavorites(userId: number, podcastId: string) {
    const podcast = await this.favoritePodcastModel.findOne({
      where: { userId, podcastId },
    })

    if (!podcast) throw new NotFoundException('Podcast not found')

    await podcast.destroy()
  }
}
