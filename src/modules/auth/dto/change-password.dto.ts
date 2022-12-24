import { Length } from 'class-validator'

export class ChangePasswordDto {
  @Length(1, 255)
  currentPassword: string

  @Length(8, 255)
  password: string
}
