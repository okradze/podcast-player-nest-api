import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { Podcast } from './podcast.model'
import { User } from '../../users/user.model'

@Table
export class FavoritePodcast extends Model<FavoritePodcast> {
  @ForeignKey(() => Podcast)
  @Column
  podcastId: string

  @BelongsTo(() => Podcast, 'podcastId')
  @Column
  podcast: Podcast

  @ForeignKey(() => User)
  @Column
  userId: number

  @BelongsTo(() => User, 'userId')
  @Column
  user: User
}
