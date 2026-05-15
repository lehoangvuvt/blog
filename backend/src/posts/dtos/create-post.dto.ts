import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsJSON,
  IsOptional,
  IsString,
} from 'class-validator';

export default class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  subTitle: string;

  @IsJSON()
  jsonContent: string;

  @IsString()
  htmlContent: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tags: string[];

  @IsBoolean()
  published: boolean;

  @IsString()
  @IsOptional()
  thumbnailImage?: string;
}
