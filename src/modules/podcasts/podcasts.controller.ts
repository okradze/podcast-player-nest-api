import { Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { AccessTokenGuard } from '../auth/guards/access-token.guard'
import { RequestUser } from '../auth/strategies/refresh-token.strategy'
import { ListenNotesService } from './listenNotes.service'
import { PodcastsService } from './podcasts.service'

@Controller('podcasts')
export class PodcastsController {
  constructor(
    private readonly listenNotesService: ListenNotesService,
    private readonly podcastsService: PodcastsService,
  ) {}

  @Get('best')
  getBestPodcasts(@Query('page') page: string) {
    return this.listenNotesService.getBestPodcasts(page)
  }

  @Get('curated')
  getCurated(@Query('page') page: string) {
    return this.listenNotesService.getCuratedPodcasts(page)
  }

  @UseGuards(AccessTokenGuard)
  @Get('favorites')
  getFavorites(@CurrentUser() user: RequestUser) {
    return this.podcastsService.getFavorites(user.userId)
  }

  @UseGuards(AccessTokenGuard)
  @Post('favorites/:id')
  addToFavorites(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.podcastsService.addToFavorites(user.userId, id)
  }

  @UseGuards(AccessTokenGuard)
  @Delete('favorites/:id')
  removeFromFavorites(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.podcastsService.removeFromFavorites(user.userId, id)
  }

  @Get(':id')
  getPodcast(
    @Param('id') id: string,
    @Query('nextEpisodePubDate') nextEpisodePubDate?: string,
  ) {
    return this.listenNotesService.getPodcast(id, nextEpisodePubDate)
  }

  @Get(':id/recommendations')
  getPodcastRecommendations(@Param('id') id: string) {
    return this.listenNotesService.getPodcastRecommendations(id)
  }

  @Get('typeahead')
  getTypeahead(@Query('q') searchTerm: string) {
    return this.listenNotesService.getTypeahead(searchTerm)
  }
}
