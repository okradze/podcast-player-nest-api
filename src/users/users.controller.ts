import { Controller, Post } from '@nestjs/common'

@Controller('users')
export class UsersController {
  @Post('signup')
  signup() {
    return 'signup'
  }

  @Post('signin')
  signin() {
    return 'signin'
  }
}
