import { Table, Column, Model, AllowNull, Index } from 'sequelize-typescript'

@Table
export class User extends Model<User> {
  @Column
  fullName: string

  @Index
  @Column
  email: string

  @Column
  password: string

  @AllowNull
  @Column
  refreshToken: string
}
