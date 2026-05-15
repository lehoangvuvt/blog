import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PostsController],
  exports: [PostsService],
  providers: [PostsService, PrismaService],
})
export class PostsModule {}
