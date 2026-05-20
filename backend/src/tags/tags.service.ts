import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TagsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(page = 1, limit = 10, search?: string) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Number(limit) || 10);

    const skip = (safePage - 1) * safeLimit;

    const where = search
      ? {
          name: {
            contains: search,
            mode: 'insensitive' as const,
          },
        }
      : {};

    const [tags, total] = await Promise.all([
      this.prismaService.tag.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy: {
          id: 'desc',
        },
      }),

      this.prismaService.tag.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / safeLimit);

    const hasMore = safePage < totalPages;

    return {
      data: tags,

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
}
