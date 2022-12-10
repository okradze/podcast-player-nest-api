import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { FavoritePodcast } from './models/favorite-podcast.model'
import { Podcast } from './models/podcast.model'
import { ListenNotesService } from './listenNotes.service'

@Injectable()
export class PodcastsService {
  constructor(
    @InjectModel(Podcast) private readonly podcastModel: typeof Podcast,
    @InjectModel(FavoritePodcast)
    private readonly favoritePodcastModel: typeof FavoritePodcast,
    private readonly listenNotesService: ListenNotesService,
  ) {}

  getFavorites(userId: number) {
    return this.favoritePodcastModel.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    })
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

    return podcast.destroy()
  }
}
