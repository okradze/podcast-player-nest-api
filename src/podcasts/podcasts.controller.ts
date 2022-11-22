import { Controller, Get, Param } from '@nestjs/common'
import { ListenNotesService } from './listenNotes.service'

@Controller('podcasts')
export class PodcastsController {
  constructor(private readonly listenNotesService: ListenNotesService) {}

  @Get('best')
  getBestPodcasts(@Param('page') page: string) {
    return this.listenNotesService.getBestPodcasts(page)
  }

  @Get('curated')
  getCurated(@Param('page') page: string) {
    return this.listenNotesService.getCuratedPodcasts(page)
  }

  @Get(':id')
  getPodcast(@Param('id') id: string) {
    return this.listenNotesService.getPodcast(id)
  }

  @Get(':id/recommendations')
  getPodcastRecommendations(@Param('id') id: string) {
    return this.listenNotesService.getPodcastRecommendations(id)
  }

  @Get('typeahead')
  getTypeahead(@Param('q') searchTerm: string) {
    return this.listenNotesService.getTypeahead(searchTerm)
  }
}
