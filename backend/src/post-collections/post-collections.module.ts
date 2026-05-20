import { Module } from '@nestjs/common';
import { PostCollectionsService } from './post-collections.service';
import { PostCollectionsController } from './post-collections.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PostCollectionsController],
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: '7d',
        },
      }),
    }),
  ],
  providers: [PostCollectionsService, PrismaService, JwtAuthGuard],
})
export class PostCollectionsModule {}
