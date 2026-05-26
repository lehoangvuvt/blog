import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5, {
    message: 'Password minimum length must be 5 characters',
  })
  password: string;
}
