import { Length } from 'class-validator'

export class ResetPasswordDto {
  @Length(8, 255)
  password: string
}
