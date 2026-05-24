import { Module } from '@nestjs/common';
import { PostsEmailQueueService } from './posts-email-queue.service';
import { PostsEmailQueueController } from './posts-email-queue.controller';
import { BullModule } from '@nestjs/bullmq';
import { PrismaService } from 'src/prisma.service';
import { EmailService } from 'src/email/email.service';
import { PostsEmailProducer } from './producers/posts-email.producer';
import PostsEmailProcessor from './processors/posts-email.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'posts-email',
    }),
  ],
  controllers: [PostsEmailQueueController],
  providers: [
    PostsEmailQueueService,
    PostsEmailProducer,
    PostsEmailProcessor,
    PrismaService,
    EmailService,
  ],
  exports: [PostsEmailProducer],
})
export class PostsEmailQueueModule {}
