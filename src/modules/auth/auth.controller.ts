import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import { SignupDto } from './dto/signup.dto'
import { AuthService } from './auth.service'
import { SigninDto } from './dto/signin.dto'
import { AccessTokenGuard } from './guards/access-token.guard'
import { RefreshTokenGuard } from './guards/refresh-token.guard'
import { CurrentUser } from './decorators/current-user.decorator'
import { RefreshTokenPayload } from './strategies/refresh-token.strategy'
import { AccessTokenPayload } from './strategies/access-token.strategy'
import { Request, Response } from 'express'
import {
  clearTokensFromCookies,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from './auth.utils'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Res({ passthrough: true }) res: Response, @Body() body: SignupDto) {
    const tokens = await this.authService.signup(body)
    setAccessTokenCookie(res, tokens.accessToken)
    setRefreshTokenCookie(res, tokens.refreshToken)
    return tokens
  }

  @Post('signin')
  async signin(@Res({ passthrough: true }) res: Response, @Body() body: SigninDto) {
    const tokens = await this.authService.signin(body)
    setAccessTokenCookie(res, tokens.accessToken)
    setRefreshTokenCookie(res, tokens.refreshToken)
    return tokens
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
    setAccessTokenCookie(res, tokens.accessToken)
    setRefreshTokenCookie(res, tokens.refreshToken)

    return tokens
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  me(@Req() req: Request) {
    // return this.authService.me(user.userId)
  }
}
