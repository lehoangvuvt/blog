import { Injectable, NotFoundException } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from 'src/prisma.service';
import { GetRepliesQueryDto } from './dtos/get-replies-query.dto';
import CreateCommentDto from './dtos/create-comment.dtot';

@Injectable()
export class PostCommentsService {
  constructor(private prismaService: PrismaService) {}

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

  async create(userId: string, dto: CreateCommentDto) {
    const { content, postId, replyToCommentId } = dto;

    await this.ensurePostExists(postId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await this.prismaService.$transaction(async (tx) => {
      const comment = await tx.postComments.create({
        data: {
          ...(replyToCommentId && {
            reply_to_comment_id: replyToCommentId,
          }),
          content,
          post_id: postId,
          user_id: userId,
        },
        include: {
          user: true,
        },
      });

      await tx.postStatistics.upsert({
        where: { post_id: postId },
        update: {
          comments_count: { increment: 1 },
        },
        create: {
          post_id: postId,
          comments_count: 1,
        },
      });

      await tx.postMetricDaily.upsert({
        where: {
          post_id_date: {
            post_id: postId,
            date: today,
          },
        },
        update: {
          comments_count: { increment: 1 },
        },
        create: {
          post_id: postId,
          date: today,
          comments_count: 1,
        },
      });

      return comment;
    });
  }

  async delete(userId: string, commentId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await this.prismaService.$transaction(async (tx) => {
      const existingComment = await tx.postComments.findFirst({
        where: {
          id: commentId,
          user_id: userId,
          is_deleted: false,
        },
      });

      if (!existingComment) {
        throw new NotFoundException('Comment not found');
      }

      await tx.postComments.update({
        where: {
          id: commentId,
        },
        data: {
          is_deleted: true,
          deleted_at: new Date(),
          content: '',
        },
      });

      await tx.postStatistics.update({
        where: {
          post_id: existingComment.post_id,
        },
        data: {
          comments_count: { decrement: 1 },
        },
      });

      await tx.postMetricDaily.update({
        where: {
          post_id_date: {
            post_id: existingComment.post_id,
            date: today,
          },
        },
        data: {
          comments_count: { decrement: 1 },
        },
      });

      return {
        deleted: true,
      };
    });
  }

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
