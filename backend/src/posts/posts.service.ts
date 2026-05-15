/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import DOMPurify from 'isomorphic-dompurify';
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from 'src/prisma.service';
import type CreatePostDto from './dtos/create-post.dto';
import type { Prisma } from 'generated/prisma/browser';
import type { FindManyPostsDto } from './dtos/find-many-posts.dto';

@Injectable()
export class PostsService {
  constructor(private prismaService: PrismaService) {}

  generateSlug(text: string): string {
    const slug = text
      .normalize('NFD')
      // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    return `${slug}-${nanoid(6)}`;
  }

  sanitizedHtmlContent(htmlContent: string): string {
    return DOMPurify.sanitize(htmlContent ?? '', {
      ALLOWED_TAGS: [
        'p',
        'br',
        'strong',
        'em',
        'u',
        's',
        'h1',
        'h2',
        'h3',
        'ul',
        'ol',
        'li',
        'blockquote',
        'a',
        'img',
        'pre',
        'code',
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel'],
    });
  }

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
              id: true,
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
        author: post.author,
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
        html_content: this.sanitizedHtmlContent(htmlContent),
        ...(thumbnailImage && { thumbnail_image: thumbnailImage }),
        authorId: 'f3781824-de4a-4433-910d-9cc426608bbf',
        slug: this.generateSlug(title),
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

    return {
      id: post.id,
      title: post.title,
      subTitle: post.sub_title,
      htmlContent: post.html_content,
      thumbnailImage: post.thumbnail_image
        ? String(post.thumbnail_image)
        : null,
      createdAt: post.created_at,
      slug: post.slug,
      tags: post.tags,
    };
  }
}
