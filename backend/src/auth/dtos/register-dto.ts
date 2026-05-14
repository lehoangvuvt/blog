import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export default class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  @MaxLength(20)
  password: string;
}
