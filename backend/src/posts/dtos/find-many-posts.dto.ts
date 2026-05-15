import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

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
  @IsString()
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
  @Transform(({ value }) => value === 'true')
  published?: boolean;
}
