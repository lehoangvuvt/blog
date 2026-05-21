import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class FindManyPostsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;

    if (Array.isArray(value)) {
      return value
        .flatMap((item) => String(item).split(','))
        .map((id) => id.trim())
        .filter(Boolean);
    }

    return String(value)
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);
  })
  @IsArray()
  @IsString({ each: true })
  authorIds?: string[] | string;

  @IsOptional()
  @IsIn(['latest', 'oldest', 'popular'])
  sortBy?: 'latest' | 'oldest' | 'popular';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined) return undefined;
    return value === true || value === 'true';
  })
  @IsBoolean()
  published?: boolean;
}
