import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common'
import { Response } from 'express'
import { SignupDto } from './dto/signup.dto'
import { AuthService } from './auth.service'
import { SigninDto } from './dto/signin.dto'
import { AccessTokenGuard } from './guards/access-token.guard'
import { RefreshTokenGuard } from './guards/refresh-token.guard'
import { CurrentUser } from './decorators/current-user.decorator'
import { RefreshTokenPayload } from './strategies/refresh-token.strategy'
import { AccessTokenPayload } from './strategies/access-token.strategy'
import { clearTokensFromCookies, setTokensToCookies } from './auth.utils'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Res({ passthrough: true }) res: Response, @Body() body: SignupDto) {
    const { tokens, user } = await this.authService.signup(body)
    setTokensToCookies(res, tokens)
    return user
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Res({ passthrough: true }) res: Response, @Body() body: SigninDto) {
    const { tokens, user } = await this.authService.signin(body)
    setTokensToCookies(res, tokens)
    return user
  }

  @UseGuards(AccessTokenGuard)
  @Post('signout')
  @HttpCode(HttpStatus.OK)
  signout(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: AccessTokenPayload,
  ) {
    clearTokensFromCookies(res)
    return this.authService.signout(user.userId)
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: RefreshTokenPayload,
  ) {
    const { userId, refreshToken } = user
    const tokens = await this.authService.refreshTokens(userId, refreshToken)
    setTokensToCookies(res, tokens)
    return tokens
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  me(@CurrentUser() user: AccessTokenPayload) {
    return this.authService.me(user.userId)
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email)
  }

  @Post('reset-password/:token')
  resetPassword(@Param('token') token: string, @Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(token, body.password)
  }

  @Get('reset-password/:token')
  getResetPasswordUser(@Param('token') token: string) {
    return this.authService.getResetPasswordUser(token)
  }
}
