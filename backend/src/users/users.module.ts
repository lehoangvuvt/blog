import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  controllers: [UsersController],
  exports: [UsersService],
  imports: [PostsModule],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
