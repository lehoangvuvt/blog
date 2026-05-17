/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, NotFoundException } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from 'src/prisma.service';
import type CreatePostDto from './dtos/create-post.dto';
import type { Prisma } from 'generated/prisma/browser';
import type { FindManyPostsDto } from './dtos/find-many-posts.dto';
import { generateSlug, sanitizedHtmlContent } from 'src/shared/utils';

@Injectable()
export class PostsService {
  constructor(private prismaService: PrismaService) {}

  async findMany(dto: FindManyPostsDto) {
    const {
      search,
      tag,
      authorId,
      published,
      page = 1,
      limit = 10,
      sortBy = 'latest',
    } = dto;

    const safePage = Math.max(Number(page), 1);
    const safeLimit = Math.min(Math.max(Number(limit), 1), 50);

    const where: Prisma.PostWhereInput = {
      ...(typeof published === 'boolean' && { published }),
      ...(authorId && { authorId }),

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
            name: tag.trim().toLowerCase(),
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

  async create(dto: CreatePostDto) {
    const {
      jsonContent,
      htmlContent,
      title,
      subTitle,
      published,
      tags,
      thumbnailImage,
    } = dto;
    return await this.prismaService.post.create({
      data: {
        title,
        sub_title: subTitle,
        json_content: jsonContent,
        html_content: sanitizedHtmlContent(htmlContent),
        ...(thumbnailImage && { thumbnail_image: thumbnailImage }),
        authorId: 'f3781824-de4a-4433-910d-9cc426608bbf',
        slug: generateSlug(title),
        published,
        tags: {
          connectOrCreate: tags.map((tag) => ({
            where: {
              name: tag.trim().toLowerCase(),
            },
            create: {
              name: tag.trim().toLowerCase(),
            },
          })),
        },
      },
    });
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
}
