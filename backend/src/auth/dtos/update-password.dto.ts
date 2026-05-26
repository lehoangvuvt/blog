import { IsString, MinLength } from 'class-validator';

export default class UpdatePasswordDto {
  @IsString()
  @MinLength(5, {
    message: "Current password minimum's length is 4 characters",
  })
  currentPassword: string;

  @IsString()
  @MinLength(5, {
    message: "New password minimum's length is 4 characters",
  })
  newPassword: string;
}
