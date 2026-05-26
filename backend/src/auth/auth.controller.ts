import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { AuthService } from './auth.service';
import RegisterDto from './dtos/register.dto';
import { CreatePendingRegistrationDto } from './dtos/create-pending-registration.dto';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import LoginDto from './dtos/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { CreateResetPasswordRequestDto } from './dtos/create-request-password-request.dto';
import UpdatePasswordDto from './dtos/update-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(
    @CurrentUser()
    user: {
      sub: string;
    },
  ) {
    return await this.authService.getMe(user.sub);
  }

  @Post('/register')
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @Post('register/email')
  async createPendingRegistration(@Body() dto: CreatePendingRegistrationDto) {
    return await this.authService.createPendingRegistration(dto);
  }

  @Get('/verify-email/check')
  async checkVerifyEmailToken(
    @Query('token')
    token: string,
  ) {
    return await this.authService.checkVerifyEmailToken(token);
  }

  @Post('/verify-email')
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return await this.authService.verifyEmail(dto.token);
  }

  @Post('/reset-password/request')
  async createResetPasswordRequest(@Body() dto: CreateResetPasswordRequestDto) {
    return await this.authService.createPendingResetPasswordRequest(dto.email);
  }

  @Get('/reset-password/check')
  async checkResetPasswordToken(
    @Query('token')
    token: string,
  ) {
    return await this.authService.checkResetPasswordToken(token);
  }

  @Post('/reset-password')
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Query('token')
    token: string,
  ) {
    return await this.authService.resetPassword(token, dto.password);
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

  @UseGuards(JwtAuthGuard)
  @Put('/password')
  async updatePassword(
    @Body() body: UpdatePasswordDto,
    @CurrentUser() user: { sub: string },
  ) {
    return this.authService.updatePassword(user.sub, body);
  }
}
