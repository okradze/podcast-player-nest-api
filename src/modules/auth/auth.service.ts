import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { User } from './user.model'
import { SignupDto } from './dto/signup-dto'

@Injectable()
export class AuthService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async signup(signupDto: SignupDto) {
    const user = await this.userModel.create<User>(signupDto)
    return user
  }
}
