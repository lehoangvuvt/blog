import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import RegisterDto from './dtos/register-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @Post('/login')
  async login(@Body() body: RegisterDto) {
    return await this.authService.login(body);
  }

  @Post('/verify')
  verify(@Body() body: { token: string }) {
    const decoded = this.authService.verifyToken(body.token);
    const userId = decoded.sub;
    return userId;
  }
}
