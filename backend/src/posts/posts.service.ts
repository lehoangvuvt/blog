/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from 'src/prisma.service';
import type CreatePostDto from './dtos/create-post.dto';
import type { Prisma } from 'generated/prisma/browser';
import type { FindManyPostsDto } from './dtos/find-many-posts.dto';
import { generateSlug, sanitizedHtmlContent } from 'src/shared/utils';
// import { PostsEmailProducer } from 'src/posts-email-queue/producers/posts-email.producer';

@Injectable()
export class PostsService {
  constructor(
    private prismaService: PrismaService,
    // private readonly postsEmailProducer: PostsEmailProducer,
  ) {}

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

  async findMany(dto: FindManyPostsDto) {
    const {
      search,
      tag,
      authorId,
      authorIds,
      published,
      page = 1,
      limit = 10,
      sortBy = 'latest',
    } = dto;

    const safePage = Math.max(Number(page), 1);
    const safeLimit = Math.min(Math.max(Number(limit), 1), 50);
    const normalizedAuthorIds: string[] = Array.isArray(authorIds)
      ? authorIds
          .map(String)
          .map((id) => id.trim())
          .filter(Boolean)
      : typeof authorIds === 'string'
        ? authorIds
            .split(',')
            .map((id) => id.trim())
            .filter(Boolean)
        : [];

    const uniqueAuthorIds = [...new Set(normalizedAuthorIds)];

    const where: Prisma.PostWhereInput = {
      ...(typeof published === 'boolean' && { published }),

      ...(uniqueAuthorIds.length > 0
        ? {
            authorId: {
              in: uniqueAuthorIds,
            },
          }
        : authorId
          ? { authorId }
          : {}),

      ...(search?.trim() && {
        OR: [
          {
            title: {
              contains: search.trim(),
              mode: 'insensitive',
            },
          },
          {
            sub_title: {
              contains: search.trim(),
              mode: 'insensitive',
            },
          },
        ],
      }),

      ...(tag?.trim() && {
        tags: {
          some: {
            slug: tag.trim(),
          },
        },
      }),
    };

    const orderBy: Prisma.PostOrderByWithRelationInput =
      sortBy === 'oldest' ? { created_at: 'asc' } : { created_at: 'desc' };

    const [posts, total] = await this.prismaService.$transaction([
      this.prismaService.post.findMany({
        where,
        orderBy,
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
        select: {
          id: true,
          title: true,
          sub_title: true,
          thumbnail_image: true,
          created_at: true,
          slug: true,
          tags: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          author: {
            select: {
              slug: true,
              full_name: true,
              avatar: true,
              email: true,
            },
          },
        },
      }),

      this.prismaService.post.count({ where }),
    ]);

    const totalPages = Math.ceil(total / safeLimit);
    const hasMore = safePage < totalPages;

    return {
      data: posts.map((post) => ({
        id: post.id,
        title: post.title,
        subTitle: post.sub_title,
        slug: post.slug,
        thumbnailImage: post.thumbnail_image
          ? String(post.thumbnail_image)
          : null,
        postedDate: post.created_at,
        author: {
          email: post.author?.email,
          fullName: post.author?.full_name,
          avatar: post.author?.avatar,
          slug: post.author?.slug,
        },
        tags: post.tags,
      })),

      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages,
        hasMore,
        nextPage: hasMore ? safePage + 1 : null,
      },
    };
  }

  async create(userId: string, dto: CreatePostDto) {
    const {
      jsonContent,
      htmlContent,
      title,
      subTitle,
      published,
      tags,
      thumbnailImage,
    } = dto;
    try {
      const createdPost = await this.prismaService.post.create({
        data: {
          title,
          sub_title: subTitle,
          json_content: jsonContent,
          html_content: sanitizedHtmlContent(htmlContent),
          ...(thumbnailImage && { thumbnail_image: thumbnailImage }),
          authorId: userId,
          slug: generateSlug(title),
          published,
          tags: {
            connectOrCreate: tags.map((tag) => ({
              where: {
                name: tag.trim().toLowerCase(),
              },
              create: {
                name: tag.trim().toLowerCase(),
                slug: generateSlug(tag, false),
              },
            })),
          },
        },
      });

      // await this.postsEmailProducer.enqueuePostsEmail(createdPost.id);

      return createdPost;
    } catch {
      throw new InternalServerErrorException('Cannot create post');
    }
  }

  async findBySlug(slug: string) {
    const post = await this.prismaService.post.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        title: true,
        sub_title: true,
        html_content: true,
        thumbnail_image: true,
        created_at: true,
        slug: true,
        author: true,
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    let postsByAuthor: Array<{
      title: string;
      slug: string;
      subTitle: string;
      thumbnailImage: string | null;
    }> = [];

    if (post.author) {
      const getpostsByAuthorRes = await this.findMany({
        authorId: post.author.id,
        page: 1,
        limit: 5,
      });

      if (getpostsByAuthorRes) {
        postsByAuthor = getpostsByAuthorRes.data
          .map((p) => ({
            title: p.title,
            slug: p.slug,
            subTitle: p.subTitle,
            thumbnailImage: p.thumbnailImage,
          }))
          .filter((p) => p.slug !== post.slug);
      }
    }

    return {
      id: post.id,
      title: post.title,
      subTitle: post.sub_title,
      htmlContent: post.html_content,
      author: {
        email: post.author?.email,
        fullName: post.author?.full_name,
        avatar: post.author?.avatar,
        slug: post.author?.slug,
      },
      thumbnailImage: post.thumbnail_image
        ? String(post.thumbnail_image)
        : null,
      createdAt: post.created_at,
      slug: post.slug,
      tags: post.tags,
      postsByAuthor,
    };
  }

  async like(postId: number, userId: string) {
    await this.ensurePostExists(postId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await this.prismaService.$transaction(async (tx) => {
      const existingLike = await tx.postLikes.findUnique({
        where: {
          user_id_post_id: {
            user_id: userId,
            post_id: postId,
          },
        },
      });

      if (existingLike) return existingLike;

      const like = await tx.postLikes.create({
        data: { user_id: userId, post_id: postId },
      });

      await tx.postStatistics.upsert({
        where: { post_id: postId },
        update: { likes_count: { increment: 1 } },
        create: { post_id: postId, likes_count: 1 },
      });

      const interaction = await tx.postDailyUserInteraction.upsert({
        where: {
          post_id_user_id_date: {
            post_id: postId,
            user_id: userId,
            date: today,
          },
        },
        update: {},
        create: {
          post_id: postId,
          user_id: userId,
          date: today,
          liked: false,
        },
      });

      if (!interaction.liked) {
        await tx.postMetricDaily.upsert({
          where: {
            post_id_date: {
              post_id: postId,
              date: today,
            },
          },
          update: {
            likes_count: { increment: 1 },
          },
          create: {
            post_id: postId,
            date: today,
            likes_count: 1,
          },
        });

        await tx.postDailyUserInteraction.update({
          where: {
            post_id_user_id_date: {
              post_id: postId,
              user_id: userId,
              date: today,
            },
          },
          data: {
            liked: true,
          },
        });
      }

      return like;
    });
  }

  async unlike(postId: number, userId: string) {
    await this.ensurePostExists(postId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await this.prismaService.$transaction(async (tx) => {
      const existingLike = await tx.postLikes.findUnique({
        where: {
          user_id_post_id: {
            user_id: userId,
            post_id: postId,
          },
        },
      });

      if (!existingLike) return { liked: false };

      await tx.postLikes.delete({
        where: {
          user_id_post_id: {
            user_id: userId,
            post_id: postId,
          },
        },
      });

      await tx.postStatistics.update({
        where: { post_id: postId },
        data: { likes_count: { decrement: 1 } },
      });

      const interaction = await tx.postDailyUserInteraction.upsert({
        where: {
          post_id_user_id_date: {
            post_id: postId,
            user_id: userId,
            date: today,
          },
        },
        update: {},
        create: {
          post_id: postId,
          user_id: userId,
          date: today,
          liked: false,
        },
      });

      if (interaction.liked) {
        await tx.postMetricDaily.update({
          where: {
            post_id_date: {
              post_id: postId,
              date: today,
            },
          },
          data: {
            likes_count: { decrement: 1 },
          },
        });

        await tx.postDailyUserInteraction.update({
          where: {
            post_id_user_id_date: {
              post_id: postId,
              user_id: userId,
              date: today,
            },
          },
          data: {
            liked: false,
          },
        });
      }

      return { liked: false };
    });
  }

  async repost(postId: number, userId: string) {
    await this.ensurePostExists(postId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await this.prismaService.$transaction(async (tx) => {
      const existingRepost = await tx.postReposts.findUnique({
        where: {
          user_id_post_id: {
            user_id: userId,
            post_id: postId,
          },
        },
      });

      if (existingRepost) return existingRepost;

      const repost = await tx.postReposts.create({
        data: { user_id: userId, post_id: postId },
      });

      await tx.postStatistics.upsert({
        where: { post_id: postId },
        update: { reposts_count: { increment: 1 } },
        create: { post_id: postId, reposts_count: 1 },
      });

      const interaction = await tx.postDailyUserInteraction.upsert({
        where: {
          post_id_user_id_date: {
            post_id: postId,
            user_id: userId,
            date: today,
          },
        },
        update: {},
        create: {
          post_id: postId,
          user_id: userId,
          date: today,
        },
      });

      if (!interaction.reposted) {
        await tx.postMetricDaily.upsert({
          where: {
            post_id_date: {
              post_id: postId,
              date: today,
            },
          },
          update: {
            reposts_count: { increment: 1 },
          },
          create: {
            post_id: postId,
            date: today,
            reposts_count: 1,
          },
        });

        await tx.postDailyUserInteraction.update({
          where: {
            post_id_user_id_date: {
              post_id: postId,
              user_id: userId,
              date: today,
            },
          },
          data: {
            reposted: true,
          },
        });
      }

      return repost;
    });
  }

  async unRepost(postId: number, userId: string) {
    await this.ensurePostExists(postId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await this.prismaService.$transaction(async (tx) => {
      const existingRepost = await tx.postReposts.findUnique({
        where: {
          user_id_post_id: {
            user_id: userId,
            post_id: postId,
          },
        },
      });

      if (!existingRepost) return { reposted: false };

      await tx.postReposts.delete({
        where: {
          user_id_post_id: {
            user_id: userId,
            post_id: postId,
          },
        },
      });

      await tx.postStatistics.update({
        where: { post_id: postId },
        data: {
          reposts_count: { decrement: 1 },
        },
      });

      const interaction = await tx.postDailyUserInteraction.upsert({
        where: {
          post_id_user_id_date: {
            post_id: postId,
            user_id: userId,
            date: today,
          },
        },
        update: {},
        create: {
          post_id: postId,
          user_id: userId,
          date: today,
          reposted: false,
        },
      });

      if (interaction.reposted) {
        await tx.postMetricDaily.update({
          where: {
            post_id_date: {
              post_id: postId,
              date: today,
            },
          },
          data: {
            reposts_count: { decrement: 1 },
          },
        });

        await tx.postDailyUserInteraction.update({
          where: {
            post_id_user_id_date: {
              post_id: postId,
              user_id: userId,
              date: today,
            },
          },
          data: {
            reposted: false,
          },
        });
      }

      return { reposted: false };
    });
  }

  async getPostStatistics(postId: number, userId?: string) {
    await this.ensurePostExists(postId);

    const [likesCount, repostsCount, commentsCount, liked, reposted] =
      await Promise.all([
        this.prismaService.postLikes.count({
          where: { post_id: postId },
        }),

        this.prismaService.postReposts.count({
          where: { post_id: postId },
        }),

        this.prismaService.postComments.count({
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
      likesCount,
      repostsCount,
      commentsCount,
      liked: Boolean(liked),
      reposted: Boolean(reposted),
    };
  }

  async savePost(userId: string, postId: number) {
    const post = await this.ensurePostExists(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.prismaService.userSavedPosts.upsert({
      where: {
        user_id_post_id: {
          user_id: userId,
          post_id: postId,
        },
      },
      update: {},
      create: {
        user_id: userId,
        post_id: postId,
      },
    });
  }

  async unsavePost(userId: string, postId: number) {
    const post = await this.ensurePostExists(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    try {
      return await this.prismaService.userSavedPosts.delete({
        where: {
          user_id_post_id: {
            user_id: userId,
            post_id: postId,
          },
        },
      });
    } catch {
      throw new NotFoundException('You have not saved this post yet');
    }
  }
}
