import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import { SignupDto } from './dto/signup-dto'
import { AuthService } from './auth.service'
import { SigninDto } from './dto/signin-dto'
import { JwtAuthGuard } from './guards/jwt-auth-guard'

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

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  signout(@Request() req) {
    return this.authService.signout()
  }
}
