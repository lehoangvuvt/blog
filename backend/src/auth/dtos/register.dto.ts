import { IsString, MaxLength, MinLength } from 'class-validator';

export default class RegisterDto {
  @IsString()
  token: string;

  @IsString()
  fullName: string;

  @IsString()
  @MinLength(5)
  @MaxLength(20)
  password: string;
}
