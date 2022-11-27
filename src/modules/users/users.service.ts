import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
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

  create(values: CreateUserDto) {
    return this.userModel.create(values)
  }

  update(id: number, values: Partial<UpdateUserDto>) {
    return this.userModel.update(values, { where: { id } })
  }
}
