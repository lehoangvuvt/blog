import { Controller } from '@nestjs/common';
import { PostsEmailQueueService } from './posts-email-queue.service';

@Controller('posts-email-queue')
export class PostsEmailQueueController {
  constructor(
    private readonly postsEmailQueueService: PostsEmailQueueService,
  ) {}
}
