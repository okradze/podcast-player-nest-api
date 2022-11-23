import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { User } from './user.model'
import { SignupDto } from './dto/signup-dto'
import { SigninDto } from './dto/signin-dto'

@Injectable()
export class AuthService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async signup(signupDto: SignupDto) {
    const user = await this.userModel.create(signupDto)
    return user
  }

  async signin(signinDto: SigninDto) {
    const user = await this.userModel.findOne({
      where: {
        email: signinDto.email,
      },
    })

    if (!user || user.password !== signinDto.password)
      throw new UnauthorizedException('Invalid credentials')

    return user
  }
}
