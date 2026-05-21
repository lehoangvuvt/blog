import { Module } from '@nestjs/common';
import { PostStatisticsService } from './post-statistics.service';
import { PostStatisticsController } from './post-statistics.controller';
import { PostsModule } from 'src/posts/posts.module';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-guard';

@Module({
  controllers: [PostStatisticsController],
  imports: [
    PostsModule,
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
  providers: [PostStatisticsService, PrismaService, OptionalJwtAuthGuard],
})
export class PostStatisticsModule {}
