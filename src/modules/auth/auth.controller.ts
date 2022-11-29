import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import { Request, Response } from 'express'
import { SignupDto } from './dto/signup.dto'
import { AuthService } from './auth.service'
import { SigninDto } from './dto/signin.dto'
import { AccessTokenGuard } from './guards/access-token.guard'
import { RefreshTokenGuard } from './guards/refresh-token.guard'
import { CurrentUser } from './decorators/current-user.decorator'
import { RefreshTokenPayload } from './strategies/refresh-token.strategy'
import { AccessTokenPayload } from './strategies/access-token.strategy'
import { clearTokensFromCookies, setTokensToCookies } from './auth.utils'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Res({ passthrough: true }) res: Response, @Body() body: SignupDto) {
    const { tokens, user } = await this.authService.signup(body)
    setTokensToCookies(res, tokens)
    return user
  }

  @Post('signin')
  async signin(@Res({ passthrough: true }) res: Response, @Body() body: SigninDto) {
    const { tokens, user } = await this.authService.signin(body)
    setTokensToCookies(res, tokens)
    return user
  }

  @UseGuards(AccessTokenGuard)
  @Post('signout')
  signout(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: AccessTokenPayload,
  ) {
    clearTokensFromCookies(res)
    return this.authService.signout(user.userId)
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: RefreshTokenPayload,
  ) {
    const { userId, refreshToken } = user
    const tokens = await this.authService.refreshTokens(userId, refreshToken)
    setTokensToCookies(res, tokens)
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  me(@Req() req: Request) {
    // return this.authService.me(user.userId)
  }
}
