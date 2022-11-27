import { Table, Column, Model, AllowNull } from 'sequelize-typescript'

@Table
export class User extends Model<User> {
  @Column
  fullName: string

  @Column
  email: string

  @Column
  password: string

  @AllowNull
  @Column
  refreshToken: string
}
