import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { JwtService } from '@nestjs/jwt'
import { User } from './user.model'
import { SignupDto } from './dto/signup.dto'
import { SigninDto } from './dto/signin.dto'
import { compareHashToData, hashData } from './auth.utils'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signTokens(userId: number) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { userId },
        {
          secret: this.configService.get('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { userId },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ])

    return { accessToken, refreshToken }
  }

  async updateUserRefreshToken(userId: number, refreshToken: string) {
    const hashedToken = await hashData(refreshToken)
    await this.userModel.update({ refreshToken: hashedToken }, { where: { id: userId } })
  }

  async signup(body: SignupDto) {
    const { email, password } = body

    const user = await this.userModel.findOne({
      where: { email },
    })

    if (user) throw new BadRequestException('Email in use')

    const hashedPassword = await hashData(password)

    const newUser = await this.userModel.create({ ...body, password: hashedPassword })
    const { accessToken, refreshToken } = await this.signTokens(newUser.id)
    await this.updateUserRefreshToken(newUser.id, refreshToken)

    return {
      user: newUser,
      accessToken,
      refreshToken,
    }
  }

  async signin(body: SigninDto) {
    const user = await this.userModel.findOne({
      where: {
        email: body.email,
      },
    })

    if (!user) throw new UnauthorizedException('Invalid credentials')

    const isMatch = await compareHashToData(user.password, body.password)
    if (!isMatch) throw new UnauthorizedException('Invalid credentials')

    const { accessToken, refreshToken } = await this.signTokens(user.id)
    await this.updateUserRefreshToken(user.id, refreshToken)

    return {
      user,
      accessToken,
      refreshToken,
    }
  }

  async signout(userId: number) {
    await this.userModel.update(
      { refreshToken: null },
      {
        where: {
          id: userId,
        },
      },
    )
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userModel.findOne({ where: { id: userId } })
    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied')

    const isMatch = await compareHashToData(user.refreshToken, refreshToken)
    if (!isMatch) throw new ForbiddenException('Access Denied')

    const tokens = await this.signTokens(user.id)
    await this.updateUserRefreshToken(user.id, tokens.refreshToken)

    return tokens
  }
}
