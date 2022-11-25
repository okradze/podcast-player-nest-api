import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { SignupDto } from './dto/signup.dto'
import { AuthService } from './auth.service'
import { SigninDto } from './dto/signin.dto'
import { AccessTokenGuard } from './guards/access-token.guard'
import { RefreshTokenGuard } from './guards/refresh-token.guard'
import { CurrentUser } from './decorators/current-user.decorator'
import { RefreshTokenPayload } from './strategies/refresh-token.strategy'
import { AccessTokenPayload } from './strategies/access-token.strategy'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body)
  }

  @Post('signin')
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body)
  }

  @UseGuards(AccessTokenGuard)
  @Post('signout')
  signout(@CurrentUser() user: AccessTokenPayload) {
    return this.authService.signout(user.userId)
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refreshTokens(@CurrentUser() user: RefreshTokenPayload) {
    const { userId, refreshToken } = user
    return this.authService.refreshTokens(userId, refreshToken)
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  me(@CurrentUser() user: AccessTokenPayload) {
    return this.authService.me(user.userId)
  }
}
