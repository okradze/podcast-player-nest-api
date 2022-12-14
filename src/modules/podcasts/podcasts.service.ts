import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { FavoritePodcast } from './models/favorite-podcast.model'
import { Podcast } from './models/podcast.model'
import {
  IBestPodcasts,
  ICuratedPodcasts,
  IPodcast,
  IPodcastDetails,
  ListenNotesService,
} from './listenNotes.service'
import { transformFavorite, transformFavorites } from './podcasts.utils'

@Injectable()
export class PodcastsService {
  constructor(
    @InjectModel(Podcast) private readonly podcastModel: typeof Podcast,
    @InjectModel(FavoritePodcast)
    private readonly favoritePodcastModel: typeof FavoritePodcast,
    private readonly listenNotesService: ListenNotesService,
  ) {}

  async populateFavoritePodcast(podcast: IPodcast | IPodcastDetails, userId: number) {
    const favoritePodcast = await this.favoritePodcastModel.findOne({
      where: { podcastId: podcast.id, userId },
    })
    podcast.isFavorite = !!favoritePodcast
    return podcast
  }

  async getBestPodcasts(
    page: string,
    userId: number | undefined,
  ): Promise<IBestPodcasts> {
    const data = await this.listenNotesService.getBestPodcasts(page)

    if (userId) {
      data.podcasts = await Promise.all(
        data.podcasts.map(podcast => this.populateFavoritePodcast(podcast, userId)),
      )
    }

    return data
  }

  async getCuratedPodcasts(
    page: string,
    userId: number | undefined,
  ): Promise<ICuratedPodcasts> {
    const data = await this.listenNotesService.getCuratedPodcasts(page)

    if (userId) {
      data.curated_lists = await Promise.all(
        data.curated_lists.map(async list => {
          list.podcasts = await Promise.all(
            list.podcasts.map(podcast => this.populateFavoritePodcast(podcast, userId)),
          )
          return list
        }),
      )
    }

    return data
  }

  async getPodcast(id: string, nextEpisodePubDate?: string, userId?: number) {
    const podcast = await this.listenNotesService.getPodcast(id, nextEpisodePubDate)
    if (userId) return this.populateFavoritePodcast(podcast, userId)
    return podcast
  }

  async getPodcastRecommendations(id: string, userId: number | undefined) {
    const data = await this.listenNotesService.getPodcastRecommendations(id)

    if (userId) {
      data.recommendations = await Promise.all(
        data.recommendations.map(podcast =>
          this.populateFavoritePodcast(podcast, userId),
        ),
      )
    }

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
    let podcast = await this.podcastModel.findByPk(podcastId)
    const favoritePodcast = await this.favoritePodcastModel.findOne({
      where: { userId, podcastId },
    })

    if (favoritePodcast) throw new BadRequestException('Podcast is already in favorites')

    if (!podcast) {
      const { id, title, publisher, thumbnail } =
        await this.listenNotesService.getPodcast(podcastId)

      podcast = await this.podcastModel.create({ id, title, thumbnail, publisher })
    }

    await this.favoritePodcastModel.create({ userId, podcastId })

    return transformFavorite(podcast)
  }

  async removeFromFavorites(userId: number, podcastId: string) {
    const podcast = await this.favoritePodcastModel.findOne({
      where: { userId, podcastId },
    })

    if (!podcast) throw new NotFoundException('Podcast not found')

    await podcast.destroy()
  }
}
