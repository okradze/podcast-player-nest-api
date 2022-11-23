import { Body, Controller, Post } from '@nestjs/common'
import { SignupDto } from './dto/signup-dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  signup(@Body() body: SignupDto) {
    return this.usersService.signup(body)
  }

  @Post('signin')
  signin() {
    return 'signin'
  }
}
