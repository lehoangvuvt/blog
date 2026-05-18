import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { EmailModule } from 'src/email/email.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AuthController],
  imports: [UsersModule, EmailModule],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
