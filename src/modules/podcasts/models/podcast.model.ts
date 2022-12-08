import { Table, Column, Model } from 'sequelize-typescript'

@Table
export class Podcast extends Model<Podcast> {
  @Column({ primaryKey: true })
  id: string

  @Column
  thumbnail: string

  @Column
  title: string

  @Column
  publisher: string
}
