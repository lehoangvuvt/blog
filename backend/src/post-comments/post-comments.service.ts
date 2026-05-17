/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from 'src/prisma.service';
import type { GetRepliesQueryDto } from './dtos/get-replies-query.dto';

@Injectable()
export class PostCommentsService {
  constructor(private prismaService: PrismaService) {}

  async getCommentsByPostId(postId: number, page: number, limit: number) {
    const [comments, total] = await Promise.all([
      this.prismaService.postComments.findMany({
        where: {
          post_id: postId,
          reply_to_comment_id: null,
        },
        include: {
          user: true,
          replies: {
            take: 3,
            orderBy: {
              created_at: 'asc',
            },
            include: {
              user: true,
            },
          },
          _count: {
            select: {
              replies: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),

      this.prismaService.postComments.count({
        where: {
          post_id: postId,
          reply_to_comment_id: null,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return {
      data: comments,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasMore,
        nextPage: hasMore ? page + 1 : null,
      },
    };
  }

  async getReplies(commentId: string, query: GetRepliesQueryDto) {
    const { limit = 5, page = 1 } = query;

    const replies = await this.prismaService.postComments.findMany({
      where: {
        reply_to_comment_id: commentId,
      },
      include: {
        user: true,
      },
      orderBy: {
        created_at: 'asc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return replies;
  }
}
