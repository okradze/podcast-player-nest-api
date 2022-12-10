import { IsString } from 'class-validator'

export class CreateFavoritePodcastDto {
  @IsString()
  id: string
}
