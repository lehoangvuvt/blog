import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';

export default class UpdateUserProfileDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/, {
    message:
      'Slug can only contain letters, numbers, and hyphens, and cannot start or end with a hyphen.',
  })
  slug?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  introduction?: string;
}
