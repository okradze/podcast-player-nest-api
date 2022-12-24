import { Length } from 'class-validator'

export class UpdateUserDto {
  @Length(2, 255)
  fullName: string
}
