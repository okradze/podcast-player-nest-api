import { Controller, Get, Param, Query } from '@nestjs/common'
import { ListenNotesService } from './listenNotes.service'

@Controller('podcasts')
export class PodcastsController {
  constructor(private readonly listenNotesService: ListenNotesService) {}

  @Get('best')
  getBestPodcasts(@Query('page') page: string) {
    console.log({ page })
    return this.listenNotesService.getBestPodcasts(page)
  }

  @Get('curated')
  getCurated(@Query('page') page: string) {
    return this.listenNotesService.getCuratedPodcasts(page)
  }

  @Get(':id')
  getPodcast(@Param('id') id: string, @Query('nextEpisodePubDate') nextEpisodePubDate?: string) {
    console.log({ id, nextEpisodePubDate })
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
