import { IsString } from 'class-validator';

export default class CreatePostCollectionDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}
