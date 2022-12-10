import { IsString } from 'class-validator'

export class DeleteFavoritePodcastDto {
  @IsString()
  id: string
}
