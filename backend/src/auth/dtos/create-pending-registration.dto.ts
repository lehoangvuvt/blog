import { IsEmail } from 'class-validator';

export class CreatePendingRegistrationDto {
  @IsEmail()
  email: string;
}
