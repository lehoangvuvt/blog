import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  controllers: [AuthController],
  imports: [UsersModule, EmailModule],
  providers: [AuthService],
})
export class AuthModule {}
