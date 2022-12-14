import {
  IBestPodcasts,
  ICuratedPodcastList,
  ICuratedPodcasts,
  IEpisode,
  IPodcast,
  IPodcastDetails,
  IRecommendations,
} from './listenNotes.service'
import { FavoritePodcast } from './models/favorite-podcast.model'

const transformPodcasts = (data: IPodcast[]): IPodcast[] =>
  data.map(({ id, thumbnail, title, publisher }) => ({
    id,
    thumbnail,
    title,
    publisher,
  }))

export const transformBestPodcastData = ({
  page_number,
  has_next,
  podcasts,
}: IBestPodcasts): IBestPodcasts => ({
  page_number,
  has_next,
  podcasts: transformPodcasts(podcasts),
})

const transformCuratedPodcastListData = ({
  id,
  podcasts,
  title,
}: ICuratedPodcastList): ICuratedPodcastList => {
  return {
    id,
    title,
    podcasts: transformPodcasts(podcasts),
  }
}

export const transformCuratedPodcastsData = ({
  page_number,
  has_next,
  curated_lists,
}: ICuratedPodcasts): ICuratedPodcasts => ({
  page_number,
  has_next,
  curated_lists: curated_lists.map(transformCuratedPodcastListData),
})

export const transformFavorites = (favorites: FavoritePodcast[]) =>
  favorites.map(favorite => {
    const { id, title, publisher, thumbnail } = favorite.podcast
    return { id, title, publisher, thumbnail, isFavorite: true }
  })

export const transformEpisodeData = ({
  id,
  title,
  thumbnail,
  audio,
  audio_length_sec,
}: IEpisode): IEpisode => ({
  id,
  title,
  thumbnail,
  audio,
  audio_length_sec,
})

export const transformPodcastDetailsData = ({
  id,
  thumbnail,
  title,
  publisher,
  description,
  next_episode_pub_date,
  total_episodes,
  episodes,
}: IPodcastDetails): IPodcastDetails => ({
  id,
  thumbnail,
  title,
  publisher,
  description,
  next_episode_pub_date,
  total_episodes,
  episodes: episodes.map(transformEpisodeData),
})

export const transformRecommendationsData = (
  data: IRecommendations,
): IRecommendations => ({
  recommendations: transformPodcasts(data.recommendations),
})
