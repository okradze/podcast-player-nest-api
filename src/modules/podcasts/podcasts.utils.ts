import {
  IBestPodcasts,
  ICuratedPodcastList,
  ICuratedPodcasts,
  IPodcast,
} from './listenNotes.service'
import { FavoritePodcast } from './models/favorite-podcast.model'

const transformPodcasts = (data: IPodcast[]): IPodcast[] =>
  data.map(({ id, thumbnail, title, publisher, description }) => ({
    id,
    thumbnail,
    title,
    publisher,
    description,
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
