import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common'
import { Response } from 'express'
import { AuthService } from './auth.service'
import { SignUpDto } from './dto/sign-up.dto'
import { SignInDto } from './dto/sign-in.dto'
import { AccessTokenGuard } from './guards/access-token.guard'
import { RefreshTokenGuard } from './guards/refresh-token.guard'
import { CurrentUser } from './decorators/current-user.decorator'
import { RefreshTokenPayload } from './strategies/refresh-token.strategy'
import { AccessTokenPayload } from './strategies/access-token.strategy'
import { clearTokensFromCookies, setTokensToCookies } from './auth.utils'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { ChangePasswordDto } from './dto/change-password.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Res({ passthrough: true }) res: Response, @Body() body: SignUpDto) {
    const { tokens, user } = await this.authService.signUp(body)
    setTokensToCookies(res, tokens)
    return user
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Res({ passthrough: true }) res: Response, @Body() body: SignInDto) {
    const { tokens, user } = await this.authService.signIn(body)
    setTokensToCookies(res, tokens)
    return user
  }

  @UseGuards(AccessTokenGuard)
  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  signOut(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: AccessTokenPayload,
  ) {
    clearTokensFromCookies(res)
    return this.authService.signOut(user.userId)
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

  @UseGuards(AccessTokenGuard)
  @Patch('update-user')
  updateUser(@CurrentUser() user: AccessTokenPayload, @Body() body: UpdateUserDto) {
    return this.authService.updateUser(user.userId, body.fullName)
  }

  @UseGuards(AccessTokenGuard)
  @Post('change-password')
  changePassword(
    @CurrentUser() user: AccessTokenPayload,
    @Body() body: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      user.userId,
      body.currentPassword,
      body.password,
    )
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
