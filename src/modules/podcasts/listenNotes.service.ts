import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { catchError, map, lastValueFrom } from 'rxjs'

export interface IPodcast {
  id: string
  thumbnail: string
  title: string
  publisher: string
  description: string
}

export interface IBestPodcasts {
  podcasts: IPodcast[]
  has_next: boolean
  page_number: number
}

export interface ICuratedPodcastList {
  id: string
  title: string
  podcasts: IPodcast[]
}

export interface ICuratedPodcasts {
  curated_lists: ICuratedPodcastList[]
  has_next: boolean
  page_number: number
}

export interface IPodcastDetails extends IPodcast {
  episodes: IEpisode[]
  next_episode_pub_date: number
}

export interface IEpisode {
  id: string
  title: string
  thumbnail: string
  audio: string
  audio_length_sec: number
}

export interface IRecommendations {
  recommendations: IPodcast[]
}

export interface ITypeahead {
  podcasts: ITypeaheadPodcast[]
}

export interface ITypeaheadPodcast {
  id: string
  title_original: string
  publisher_original: string
  thumbnail: string
}

@Injectable()
export class ListenNotesService {
  constructor(private readonly httpService: HttpService) {}

  getBestPodcasts(page: string) {
    return lastValueFrom(
      this.httpService
        .get<IBestPodcasts>(`/best_podcasts?page=${page}`)
        .pipe(map(res => res.data))
        .pipe(
          catchError(() => {
            throw new InternalServerErrorException('Could not fetch best podcasts')
          }),
        ),
    )
  }

  getCuratedPodcasts(page: string) {
    return lastValueFrom(
      this.httpService
        .get<ICuratedPodcasts>(`curated_podcasts?page=${page}`)
        .pipe(map(res => res.data))
        .pipe(
          catchError(() => {
            throw new InternalServerErrorException('Could not fetch curated podcasts')
          }),
        ),
    )
  }

  getPodcast(podcastId: string, nextEpisodePubDate?: string) {
    const url = `/podcasts/${podcastId}${
      nextEpisodePubDate ? `?next_episode_pub_date=${nextEpisodePubDate}` : ''
    }`

    return lastValueFrom(
      this.httpService
        .get<IPodcastDetails>(url)
        .pipe(map(res => res.data))
        .pipe(
          catchError(() => {
            throw new InternalServerErrorException('Could not fetch podcast')
          }),
        ),
    )
  }

  getPodcastRecommendations(podcastId: string) {
    return lastValueFrom(
      this.httpService
        .get<IRecommendations>(`/podcasts/${podcastId}/recommendations`)
        .pipe(map(res => res.data))
        .pipe(
          catchError(() => {
            throw new InternalServerErrorException('Could not fetch podcast recommendations')
          }),
        ),
    )
  }

  getTypeahead(searchTerm: string) {
    return lastValueFrom(
      this.httpService
        .get<ITypeahead>(`/typeahead?q=${searchTerm}&show_podcasts=1`)
        .pipe(map(res => res.data))
        .pipe(
          catchError(() => {
            throw new InternalServerErrorException('Could not fetch typeahead')
          }),
        ),
    )
  }
}
