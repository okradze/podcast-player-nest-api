import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { UsersService } from '../users/users.service'
import { compareHashToData, hashData } from './auth.utils'
import { SigninDto } from './dto/signin.dto'
import { SignupDto } from './dto/signup.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
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
    await this.usersService.update(userId, { refreshToken: hashedToken })
  }

  async signup(body: SignupDto) {
    const { email, password } = body

    const userAlreadyExists = await this.usersService.findByEmail(email)
    if (userAlreadyExists) throw new BadRequestException('Email in use')

    const hashedPassword = await hashData(password)
    const user = await this.usersService.create({ ...body, password: hashedPassword })

    const tokens = await this.signTokens(user.id)
    await this.updateUserRefreshToken(user.id, tokens.refreshToken)

    return {
      tokens,
      user,
    }
  }

  async signin(body: SigninDto) {
    const user = await this.usersService.findByEmail(body.email)
    if (!user) throw new BadRequestException('Invalid credentials')

    const isMatch = await compareHashToData(user.password, body.password)
    if (!isMatch) throw new BadRequestException('Invalid credentials')

    const tokens = await this.signTokens(user.id)
    await this.updateUserRefreshToken(user.id, tokens.refreshToken)

    return {
      tokens,
      user,
    }
  }

  async signout(userId: number) {
    await this.usersService.update(userId, { refreshToken: null })
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId)
    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied')

    const isMatch = await compareHashToData(user.refreshToken, refreshToken)
    if (!isMatch) throw new ForbiddenException('Access Denied')

    const tokens = await this.signTokens(user.id)
    await this.updateUserRefreshToken(user.id, tokens.refreshToken)

    return tokens
  }

  async me(userId: number) {
    const user = await this.usersService.findById(userId)
    return user
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email)
    if (!user) throw new NotFoundException('User not found with associated email')

    const token = await this.jwtService.signAsync(
      { userId: user.id },
      {
        secret: this.configService.get('JWT_RESET_PASSWORD_SECRET'),
        expiresIn: '30m',
      },
    )

    const hashedToken = await hashData(token)
    user.resetPasswordToken = hashedToken
    await user.save()

    return { token }
  }

  async resetPassword(token: string, password: string) {
    const { userId } = await this.jwtService
      .verifyAsync(token, {
        secret: this.configService.get('JWT_RESET_PASSWORD_SECRET'),
      })
      .catch(() => {
        throw new UnauthorizedException('Token is invalid')
      })

    const user = await this.usersService.findById(userId)
    if (!user) throw new NotFoundException('User not found')
    if (!user.resetPasswordToken) throw new UnauthorizedException('Token is invalid')

    const isMatch = await compareHashToData(user.resetPasswordToken, token)
    if (!isMatch) throw new UnauthorizedException('Token is invalid')

    const hashedPassword = await hashData(password)
    user.password = hashedPassword
    user.resetPasswordToken = null
    await user.save()
  }
}
