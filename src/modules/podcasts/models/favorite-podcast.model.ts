import { Table, Column, Model, ForeignKey, BelongsTo, Index } from 'sequelize-typescript'
import { Podcast } from './podcast.model'
import { User } from '../../users/user.model'

@Table
export class FavoritePodcast extends Model<FavoritePodcast> {
  @ForeignKey(() => Podcast)
  @Index
  @Column
  podcastId: string

  @BelongsTo(() => Podcast, 'podcastId')
  podcast: Podcast

  @ForeignKey(() => User)
  @Index
  @Column
  userId: number

  @BelongsTo(() => User, 'userId')
  user: User
}
