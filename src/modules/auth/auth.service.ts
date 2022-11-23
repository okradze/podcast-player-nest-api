import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { User } from './user.model'
import { SignupDto } from './dto/signup-dto'
import { SigninDto } from './dto/signin-dto'
import { compareHashToPassword, hashPassword } from './auth.utils'

@Injectable()
export class AuthService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async signup(dto: SignupDto) {
    const { email, password } = dto

    const user = await this.userModel.findOne({
      where: { email },
    })

    if (user) throw new BadRequestException('Email in use')

    const hashedPassword = await hashPassword(password)

    return this.userModel.create({ ...dto, password: hashedPassword })
  }

  async signin(dto: SigninDto) {
    const user = await this.userModel.findOne({
      where: {
        email: dto.email,
      },
    })

    if (!user) throw new UnauthorizedException('Invalid credentials')

    const isMatch = await compareHashToPassword(user.password, dto.password)
    if (!isMatch) throw new UnauthorizedException('Invalid credentials')

    return user
  }
}
