import { Body, Controller, Post } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { AuthService } from './auth.service';
import type RegisterDto from './dtos/register.dto';
import { CreatePendingRegistrationDto } from './dtos/create-pending-registration.dto';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import LoginDto from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @Post('register/email')
  createPendingRegistration(@Body() dto: CreatePendingRegistrationDto) {
    return this.authService.createPendingRegistration(dto);
  }

  @Post('/verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto.token);
  }

  @Post('/login')
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @Post('/verify')
  verify(@Body() body: { token: string }) {
    const decoded = this.authService.verifyToken(body.token);
    const userId = decoded.sub;
    return userId;
  }
}
