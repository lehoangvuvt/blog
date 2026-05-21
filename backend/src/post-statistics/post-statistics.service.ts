/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

type TrendingRange = 'daily' | 'weekly' | 'monthly';

@Injectable()
export class PostStatisticsService {
  constructor(private readonly prismaService: PrismaService) {}

  private async ensurePostExists(postId: number) {
    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  private getStartOfDay(date = new Date()) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private getDateRange(range: TrendingRange) {
    const now = new Date();

    const start = this.getStartOfDay(now);

    if (range === 'daily') {
      return { start, end: now };
    }

    if (range === 'weekly') {
      const day = start.getDay();
      const diff = day === 0 ? 6 : day - 1;
      start.setDate(start.getDate() - diff);

      return { start, end: now };
    }

    start.setDate(1);

    return { start, end: now };
  }

  async getPostStatistics(postId: number, userId?: string) {
    await this.ensurePostExists(postId);

    const [statistics, liked, reposted] = await Promise.all([
      this.prismaService.postStatistics.findUnique({
        where: { post_id: postId },
      }),

      userId
        ? this.prismaService.postLikes.findUnique({
            where: {
              user_id_post_id: {
                user_id: userId,
                post_id: postId,
              },
            },
            select: { id: true },
          })
        : Promise.resolve(null),

      userId
        ? this.prismaService.postReposts.findUnique({
            where: {
              user_id_post_id: {
                user_id: userId,
                post_id: postId,
              },
            },
            select: { id: true },
          })
        : Promise.resolve(null),
    ]);

    return {
      viewsCount: statistics?.views_count ?? 0,
      likesCount: statistics?.likes_count ?? 0,
      repostsCount: statistics?.reposts_count ?? 0,
      commentsCount: statistics?.comments_count ?? 0,
      liked: Boolean(liked),
      reposted: Boolean(reposted),
    };
  }

  async getTrendingPosts(range: TrendingRange, limit = 10) {
    const { start, end } = this.getDateRange(range);

    const metrics = await this.prismaService.postMetricDaily.groupBy({
      by: ['post_id'],
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      _sum: {
        views_count: true,
        likes_count: true,
        reposts_count: true,
        comments_count: true,
      },
    });

    const ranked = metrics
      .map((item) => {
        const views = item._sum.views_count ?? 0;
        const likes = item._sum.likes_count ?? 0;
        const reposts = item._sum.reposts_count ?? 0;
        const comments = item._sum.comments_count ?? 0;

        const score = views * 1 + likes * 5 + comments * 8 + reposts * 10;

        return {
          postId: item.post_id,
          viewsCount: views,
          likesCount: likes,
          repostsCount: reposts,
          commentsCount: comments,
          score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    const postIds = ranked.map((item) => item.postId);

    const posts = await this.prismaService.post.findMany({
      where: {
        id: {
          in: postIds,
        },
      },
      include: {
        author: true,
        postStatistics: true,
        tags: {
          select: {
            slug: true,
            name: true,
            id: true,
          },
        },
      },
    });

    const postMap = new Map(posts.map((post) => [post.id, post]));

    return ranked.map((item) => ({
      ...item,
      post: {
        id: postMap.get(item.postId)?.id,
        title: postMap.get(item.postId)?.title,
        subTitle: postMap.get(item.postId)?.sub_title,
        thumbnailImage: postMap.get(item.postId)?.thumbnail_image,
        tags: postMap.get(item.postId)?.tags,
        slug: postMap.get(item.postId)?.slug,
        postedDate: postMap.get(item.postId)?.created_at,
        author: {
          slug: postMap.get(item.postId)?.author?.slug,
          avatar: postMap.get(item.postId)?.author?.avatar,
          fullName: postMap.get(item.postId)?.author?.full_name,
          email: postMap.get(item.postId)?.author?.email,
        },
      },
    }));
  }

  async getTrendingPostsDaily(limit = 10) {
    return this.getTrendingPosts('daily', limit);
  }

  async getTrendingPostsWeekly(limit = 10) {
    return this.getTrendingPosts('weekly', limit);
  }

  async getTrendingPostsMonthly(limit = 10) {
    return this.getTrendingPosts('monthly', limit);
  }
}
