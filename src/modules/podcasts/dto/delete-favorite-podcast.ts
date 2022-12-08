import { IsMongoId } from 'class-validator'

export class DeleteFavoritePodcastDto {
  @IsMongoId()
  id: string
}
