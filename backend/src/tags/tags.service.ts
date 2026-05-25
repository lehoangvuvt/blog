/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
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

  async toggleTagFollowEmailNotify(
    userId: string,
    tagId: string,
    state: 'on' | 'off',
  ) {
    const tagFollow = await this.prismaService.tagFollow.findUnique({
      where: {
        tag_id_user_id: {
          tag_id: tagId,
          user_id: userId,
        },
      },
    });

    if (!tagFollow) {
      throw new NotFoundException('User not follow this tag');
    }

    return await this.prismaService.tagFollow.update({
      where: {
        id: tagFollow.id,
      },
      data: {
        is_email_notify: state === 'on',
      },
    });
  }

  async getFeaturedPostsByTagSlug(slug: string) {
    const tag = await this.prismaService.tag.findUnique({
      where: { slug },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    const posts = await this.prismaService.post.findMany({
      where: {
        published: true,
        tags: {
          some: {
            slug,
          },
        },
      },

      include: {
        author: {
          select: {
            avatar: true,
            full_name: true,
            slug: true,
            email: true,
          },
        },

        postStatistics: true,

        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    const rankedPosts = posts
      .map((post) => {
        const stats = post.postStatistics;

        const comments = stats?.comments_count ?? 0;
        const likes = stats?.likes_count ?? 0;
        const reposts = stats?.reposts_count ?? 0;
        const views = stats?.views_count ?? 0;

        const publishedAt = new Date(post.created_at);
        const hoursSincePublished =
          (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60);

        const engagementScore =
          comments * 5 + reposts * 4 + likes * 2 + views * 0.02;

        const finalScore = engagementScore / (hoursSincePublished + 2) ** 0.35;

        return {
          ...post,
          featured_score: finalScore,
        };
      })
      .sort((a, b) => b.featured_score - a.featured_score)
      .slice(0, 5);

    return rankedPosts.map((post) => ({
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
    }));
  }

  async getFeaturedAuthorsByTagSlug(slug: string) {
    const tag = await this.prismaService.tag.findUnique({
      where: { slug },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    const posts = await this.prismaService.post.findMany({
      where: {
        published: true,
        tags: {
          some: {
            slug,
          },
        },
      },

      include: {
        author: {
          select: {
            id: true,
            full_name: true,
            avatar: true,
            slug: true,
            email: true,
          },
        },

        postStatistics: {
          select: {
            comments_count: true,
            likes_count: true,
            reposts_count: true,
            views_count: true,
          },
        },
      },
    });

    const authorsMap = new Map<
      string,
      {
        id: string;
        fullName: string | null;
        avatar: string | null;
        slug: string;
        email: string;
        postsCount: number;
        score: number;
      }
    >();

    for (const post of posts) {
      if (!post.author) continue;

      const stats = post.postStatistics;

      const postScore =
        (stats?.comments_count ?? 0) * 5 +
        (stats?.reposts_count ?? 0) * 4 +
        (stats?.likes_count ?? 0) * 2 +
        (stats?.views_count ?? 0) * 0.02;

      const existing = authorsMap.get(post.author.id);

      if (!existing) {
        authorsMap.set(post.author.id, {
          id: post.author.id,
          fullName: post.author.full_name,
          avatar: post.author.avatar,
          slug: post.author.slug,
          email: post.author.email,
          postsCount: 1,
          score: postScore,
        });

        continue;
      }

      authorsMap.set(post.author.id, {
        ...existing,
        postsCount: existing.postsCount + 1,
        score: existing.score + postScore,
      });
    }

    return [...authorsMap.values()]
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        return b.postsCount - a.postsCount;
      })
      .slice(0, 6);
  }

  async getTagBySlug(slug: string) {
    const tag = await this.prismaService.tag.findFirst({
      where: {
        slug,
      },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return {
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      createdAt: tag.created_at,
      updatedAt: tag.updated_at,
    };
  }
}
