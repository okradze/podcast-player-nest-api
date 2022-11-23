import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { User } from './user.model'
import { SignupDto } from './dto/signup-dto'
import { SigninDto } from './dto/signin-dto'
import { compareHashToPassword, hashPassword } from './auth.utils'

@Injectable()
export class AuthService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async signup(body: SignupDto) {
    const { email, password } = body

    const user = await this.userModel.findOne({
      where: { email },
    })

    if (user) throw new BadRequestException('Email in use')

    const hashedPassword = await hashPassword(password)

    return this.userModel.create({ ...body, password: hashedPassword })
  }

  async signin(body: SigninDto) {
    const user = await this.userModel.findOne({
      where: {
        email: body.email,
      },
    })

    if (!user) throw new UnauthorizedException('Invalid credentials')

    const isMatch = await compareHashToPassword(user.password, body.password)
    if (!isMatch) throw new UnauthorizedException('Invalid credentials')

    return user
  }
}
