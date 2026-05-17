import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaService } from 'src/prisma.service';
import { PostCommentsModule } from 'src/post-comments/post-comments.module';

@Module({
  controllers: [PostsController],
  exports: [PostsService],
  imports: [PostCommentsModule],
  providers: [PostsService, PrismaService],
})
export class PostsModule {}
