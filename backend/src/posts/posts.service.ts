import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import CreatePostDto from './dtos/create-post.dto';
import { Prisma } from 'generated/prisma/browser';
import { FindManyPostsDto } from './dtos/find-many-posts.dto';

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
        thumbnailImage: post.thumbnail_image
          ? String(post.thumbnail_image)
          : null,
        postedDate: post.created_at,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        author: post.author,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
    const { content, title, subTitle, published, tags, thumbnailImage } = dto;
    return await this.prismaService.post.create({
      data: {
        title,
        sub_title: subTitle,
        content,
        ...(thumbnailImage && { thumbnail_image: thumbnailImage }),
        authorId: 'f3781824-de4a-4433-910d-9cc426608bbf',
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
}
