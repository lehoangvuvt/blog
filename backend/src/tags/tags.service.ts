/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TagsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(page = 1, limit = 10, search?: string, ids?: string) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Number(limit) || 10);
    const skip = (safePage - 1) * safeLimit;

    const searchValue = search?.trim() || null;

    const tagIds =
      ids
        ?.split(',')
        .map((id) => id.trim())
        .filter(Boolean) ?? [];

    const data = await this.prismaService.$queryRaw<
      {
        id: string;
        name: string;
        slug: string | null;
        postsCount: number;
        authorsCount: number;
      }[]
    >`
    SELECT
      t.id,
      t.name,
      t.slug,
      COUNT(p.id)::int AS "postsCount",
      COUNT(DISTINCT p."authorId")::int AS "authorsCount"
    FROM "Tag" t
    LEFT JOIN "_PostToTag" pt ON pt."B" = t.id
    LEFT JOIN "Post" p ON p.id = pt."A"
    WHERE (
      ${searchValue}::text IS NULL
      OR t.name ILIKE '%' || ${searchValue} || '%'
    )
    AND (
      ${tagIds.length} = 0
      OR t.id = ANY(${tagIds}::text[])
    )
    GROUP BY t.id, t.name, t.slug
    ORDER BY t.name ASC
    LIMIT ${safeLimit}
    OFFSET ${skip}
  `;

    const [{ total }] = await this.prismaService.$queryRaw<{ total: number }[]>`
    SELECT COUNT(*)::int AS total
    FROM "Tag" t
    WHERE (
      ${searchValue}::text IS NULL
      OR t.name ILIKE '%' || ${searchValue} || '%'
    )
    AND (
      ${tagIds.length} = 0
      OR t.id = ANY(${tagIds}::text[])
    )
  `;

    const totalPages = Math.ceil(total / safeLimit);
    const hasMore = safePage < totalPages;

    return {
      data,
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

  async followTag(userId: string, tagId: string) {
    return await this.prismaService.tagFollow.upsert({
      where: {
        tag_id_user_id: {
          tag_id: tagId,
          user_id: userId,
        },
      },
      update: {},
      create: {
        tag_id: tagId,
        user_id: userId,
      },
    });
  }

  async unfollowTag(userId: string, tagId: string) {
    return await this.prismaService.tagFollow.delete({
      where: {
        tag_id_user_id: {
          tag_id: tagId,
          user_id: userId,
        },
      },
    });
  }
}
