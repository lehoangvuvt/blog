import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateResetPasswordRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
