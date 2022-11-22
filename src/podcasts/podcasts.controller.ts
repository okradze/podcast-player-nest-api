import { Controller, Get, Param } from '@nestjs/common'

@Controller('podcasts')
export class PodcastsController {
  @Get('best')
  getBestPodcasts() {
    return 'best'
  }

  @Get('curated')
  getCurated() {
    return 'curated'
  }

  @Get(':id')
  getPodcast(@Param('id') id: string) {
    return `podcast id: ${id}`
  }

  @Get(':id/recommendations')
  getPodcastRecommendations(@Param('id') id: string) {
    return `podcast recommendations for id: ${id}`
  }
}
