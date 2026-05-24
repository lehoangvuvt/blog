import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma.service';

@Processor('posts-email')
export default class PostsEmailProcessor extends WorkerHost {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: EmailService,
  ) {
    console.log('PostsEmailProcessor booted');
    super();
  }

  async process(job: Job<{ postId: number }>) {
    console.log('process');
    const { postId } = job.data;

    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
        tags: {
          include: {
            followers: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!post || !post.published) return;

    const recipientsMap = new Map<
      string,
      {
        email: string;
        fullName: string | null;
      }
    >();

    for (const postTag of post.tags) {
      for (const follow of postTag.followers) {
        if (!follow.user.email) continue;
        if (follow.user.id === post.authorId) continue;
        recipientsMap.set(follow.user.id, {
          email: follow.user.email,
          fullName: follow.user.full_name,
        });
      }
    }

    const recipients = [...recipientsMap.values()];

    await Promise.allSettled(
      recipients.map((recipient) =>
        this.mailService.sendNewPostEmail({
          to: recipient.email,
          name: recipient.fullName ?? 'reader',
          postTitle: post.title,
          postSubTitle: post.sub_title,
          ...(post.thumbnail_image && { thumbnailImage: post.thumbnail_image }),
          postUrl: `${process.env.APP_URL}/articles/${post.slug}`,
          authorName: post.author?.full_name ?? 'Unknown writer',
        }),
      ),
    );
  }
}
