import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class PostsEmailProducer {
  constructor(@InjectQueue('posts-email') private readonly queue: Queue) {}

  async enqueuePostsEmail(postId: number) {
    await this.queue.add(
      'send-new-post-emails',
      { postId },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );
  }
}
