import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class HighlightRectDto {
  @IsNumber()
  @Min(0)
  top: number;

  @IsNumber()
  @Min(0)
  left: number;

  @IsNumber()
  @Min(0)
  width: number;

  @IsNumber()
  @Min(0)
  height: number;
}

export class CreatePostHighlightDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => HighlightRectDto)
  rects: HighlightRectDto[];
}