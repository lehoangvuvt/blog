import { Module } from '@nestjs/common';
import { PostCommentsService } from './post-comments.service';
import { PostCommentsController } from './post-comments.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PostCommentsController],
  providers: [PostCommentsService, PrismaService],
  exports: [PostCommentsService],
})
export class PostCommentsModule {}
