import { IsEmail, Length } from 'class-validator'

export class SignupDto {
  @Length(2, 255)
  fullName: string

  @IsEmail()
  email: string

  @Length(8, 255)
  password: string
}
