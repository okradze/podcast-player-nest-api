import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Attributes } from 'sequelize'
import { Col, Fn, Literal } from 'sequelize/types/utils'
import { UserDto } from './dto/user.dto'
import { User } from './user.model'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  findById(id: number) {
    return this.userModel.findOne({
      where: { id },
    })
  }

  findByEmail(email: string) {
    return this.userModel.findOne({
      where: { email },
    })
  }

  create(values: UserDto) {
    return this.userModel.create(values)
  }

  update(
    id: number,
    values: {
      [key in keyof Attributes<User>]?: Attributes<User>[key] | Fn | Col | Literal
    },
  ) {
    return this.userModel.update(values, { where: { id } })
  }
}
