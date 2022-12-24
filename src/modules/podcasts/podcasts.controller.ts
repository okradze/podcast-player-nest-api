import { Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { AccessTokenGuard } from '../auth/guards/access-token.guard'
import { OptionalAccessTokenGuard } from '../auth/guards/optional-access-token.guard'
import { AccessTokenPayload } from '../auth/strategies/access-token.strategy'
import { ListenNotesService } from './listenNotes.service'
import { PodcastsService } from './podcasts.service'

@Controller('podcasts')
export class PodcastsController {
  constructor(
    private readonly listenNotesService: ListenNotesService,
    private readonly podcastsService: PodcastsService,
  ) {}

  @UseGuards(OptionalAccessTokenGuard)
  @Get('best')
  getBestPodcasts(@CurrentUser() user: AccessTokenPayload, @Query('page') page: string) {
    return this.podcastsService.getBestPodcasts(page, user?.userId)
  }

  @UseGuards(OptionalAccessTokenGuard)
  @Get('curated')
  getCurated(@CurrentUser() user: AccessTokenPayload, @Query('page') page: string) {
    return this.podcastsService.getCuratedPodcasts(page, user?.userId)
  }

  @Get('typeahead')
  getTypeahead(@Query('q') searchTerm: string) {
    return this.listenNotesService.getTypeahead(searchTerm)
  }

  @UseGuards(AccessTokenGuard)
  @Get('favorites')
  getFavorites(@CurrentUser() user: AccessTokenPayload) {
    return this.podcastsService.getFavorites(user.userId)
  }

  @UseGuards(AccessTokenGuard)
  @Post('favorites/:id')
  addToFavorites(@CurrentUser() user: AccessTokenPayload, @Param('id') id: string) {
    return this.podcastsService.addToFavorites(user.userId, id)
  }

  @UseGuards(AccessTokenGuard)
  @Delete('favorites/:id')
  removeFromFavorites(@CurrentUser() user: AccessTokenPayload, @Param('id') id: string) {
    return this.podcastsService.removeFromFavorites(user.userId, id)
  }

  @UseGuards(OptionalAccessTokenGuard)
  @Get(':id')
  getPodcast(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id') id: string,
    @Query('nextEpisodePubDate') nextEpisodePubDate?: string,
  ) {
    return this.podcastsService.getPodcast(id, nextEpisodePubDate, user?.userId)
  }

  @UseGuards(OptionalAccessTokenGuard)
  @Get(':id/recommendations')
  getPodcastRecommendations(
    @CurrentUser() user: AccessTokenPayload,
    @Param('id') id: string,
  ) {
    return this.podcastsService.getPodcastRecommendations(id, user?.userId)
  }
}
