import { IsMongoId } from 'class-validator'

export class CreateFavoritePodcastDto {
  @IsMongoId()
  id: string
}
