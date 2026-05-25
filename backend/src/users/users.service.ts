/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, type User } from 'generated/prisma/client';
import type { FindManyPostsDto } from 'src/posts/dtos/find-many-posts.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { PostsService } from 'src/posts/posts.service';
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from 'src/prisma.service';
import { generateSlug } from 'src/shared/utils';
import UpdateUserProfileDto from './dtos/update-user-profile';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private postsService: PostsService,
  ) {}

  async ensureUserExisted(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findMany(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findOne(options: {
    email?: string;
    password?: string;
    isActive?: boolean;
  }): Promise<User | null> {
    const { email, password } = options;
    return await this.prisma.user.findFirst({
      where: {
        ...(email && { email }),
        ...(password && { password }),
      },
    });
  }

  async create(
    email: string,
    fullName: string,
    password: string,
  ): Promise<User> {
    const slug = generateSlug(fullName);

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          password,
          full_name: fullName,
          slug,
          is_active: true,
        },
      });

      return user;
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new BadRequestException('Email already exists');
      }

      throw err;
    }
  }

  async findUserPosts(dto: FindManyPostsDto) {
    const posts = await this.postsService.findMany(dto);
    return posts;
  }

  async getUserInfoBySlug(slug: string) {
    const user = await this.prisma.user.findFirst({ where: { slug } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const postsCount = await this.prisma.post.count({
      where: { authorId: user.id },
    });

    const followersCount = await this.getUserFollowers(user.id);

    return {
      id: user.id,
      slug: user.slug,
      avatar: user.avatar,
      introduction: user.introduction,
      fullName: user.full_name,
      createdAt: user.created_at,
      backgroundImage: user.background_image,
      statistics: {
        postsCount,
        followersCount: followersCount.length || 0,
      },
      social: {
        facebook: user.facebook_link,
        x: user.x_link,
        linkedin: user.linkedin_link,
        website: user.website_link,
        youtube: user.youtube_link,
      },
    };
  }

  async getUserRepostedPostsBySlug(slug: string) {
    const user = await this.prisma.user.findFirst({ where: { slug } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const posts = await this.prisma.postReposts.findMany({
      where: { user_id: user.id },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            sub_title: true,
            thumbnail_image: true,
            slug: true,
            created_at: true,
            author: {
              select: {
                slug: true,
                avatar: true,
                full_name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return posts.map((repost) => {
      return {
        id: repost.post.id,
        title: repost.post.title,
        subTitle: repost.post.sub_title,
        thumbnailImage: repost.post.thumbnail_image,
        slug: repost.post.slug,
        postedDate: repost.post.created_at,
        author: {
          slug: repost.post.author?.slug,
          avatar: repost.post.author?.avatar,
          fullName: repost.post.author?.full_name,
          email: repost.post.author?.email,
        },
      };
    });
  }

  async getUserLikedPostsBySlug(slug: string) {
    const user = await this.prisma.user.findFirst({ where: { slug } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const posts = await this.prisma.postLikes.findMany({
      where: { user_id: user.id },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            sub_title: true,
            thumbnail_image: true,
            slug: true,
            created_at: true,
            author: {
              select: {
                slug: true,
                avatar: true,
                full_name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return posts.map((repost) => {
      return {
        id: repost.post.id,
        title: repost.post.title,
        subTitle: repost.post.sub_title,
        thumbnailImage: repost.post.thumbnail_image,
        slug: repost.post.slug,
        postedDate: repost.post.created_at,
        author: {
          slug: repost.post.author?.slug,
          avatar: repost.post.author?.avatar,
          fullName: repost.post.author?.full_name,
          email: repost.post.author?.email,
        },
      };
    });
  }

  async followUser(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: {
        id: targetUserId,
      },
      select: {
        id: true,
      },
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    try {
      await this.prisma.userFollow.create({
        data: {
          follower_id: currentUserId,
          following_id: targetUserId,
        },
      });

      return {
        success: true,
        following: true,
      };
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new BadRequestException('You are already following this user');
      }

      throw new InternalServerErrorException('Failed to follow user');
    }
  }

  async unfollowUser(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('You cannot unfollow yourself');
    }

    try {
      await this.prisma.userFollow.delete({
        where: {
          follower_id_following_id: {
            follower_id: currentUserId,
            following_id: targetUserId,
          },
        },
      });

      return {
        success: true,
        following: false,
      };
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        throw new BadRequestException('You are not following this user');
      }

      throw new InternalServerErrorException('Failed to unfollow user');
    }
  }

  async getUserFollowings(userId: string) {
    const followings = await this.prisma.userFollow.findMany({
      where: { follower_id: userId },
      include: {
        following: {
          select: {
            id: true,
            full_name: true,
            slug: true,
            avatar: true,
            email: true,
            created_at: true,
            introduction: true,
          },
        },
      },
    });

    return followings.map((f) => {
      return {
        id: f.following.id,
        fullName: f.following.full_name,
        slug: f.following.slug,
        avatar: f.following.avatar,
        email: f.following.email,
        createdAt: f.following.created_at,
        introduction: f.following.introduction,
      };
    });
  }

  async getUserFollowers(userId: string) {
    const followers = await this.prisma.userFollow.findMany({
      where: { following_id: userId },
      include: {
        follower: {
          select: {
            id: true,
            full_name: true,
            slug: true,
            avatar: true,
            email: true,
            created_at: true,
            introduction: true,
          },
        },
      },
    });

    return followers.map((f) => {
      return {
        id: f.follower.id,
        fullName: f.follower.full_name,
        slug: f.follower.slug,
        avatar: f.follower.avatar,
        email: f.follower.email,
        createdAt: f.follower.created_at,
        introduction: f.follower.introduction,
      };
    });
  }

  async getUserSavedPosts(userId: string) {
    const posts = await this.prisma.userSavedPosts.findMany({
      where: {
        user_id: userId,
      },
      include: {
        post: {
          select: {
            id: true,
            slug: true,
            title: true,
            thumbnail_image: true,
            created_at: true,
            sub_title: true,
            author: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return posts.map((p) => {
      const post = p.post;
      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        subTitle: post.sub_title,
        thumbnailImage: post.thumbnail_image,
        postedDate: post.created_at,
        author: {
          id: post.author?.id,
          fullName: post.author?.full_name,
          slug: post.author?.slug,
          avatar: post.author?.avatar,
          email: post.author?.email,
        },
      };
    });
  }

  async updateUserProfile(userId: string, dto: UpdateUserProfileDto) {
    await this.ensureUserExisted(userId);
    console.log(dto instanceof UpdateUserProfileDto);
    console.log(dto);
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...(dto.fullName && { full_name: dto.fullName }),
          ...(dto.slug && { slug: dto.slug }),
          ...(dto.email && { email: dto.email }),
          ...(dto.avatarUrl && { avatar: dto.avatarUrl }),
          ...(dto.introduction && { introduction: dto.introduction }),
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          if (err.message.includes('email')) {
            throw new BadRequestException('Email already exists');
          }

          if (err.message.includes('slug')) {
            throw new BadRequestException('Slug already exists');
          }
        }
      }

      throw new InternalServerErrorException('Failed to update user profile');
    }
  }

  async getUserReadingHistories(userId: string) {
    const histories = await this.prisma.userReadingHistory.findMany({
      where: {
        user_id: userId,
      },
      include: {
        post: {
          include: {
            author: {
              select: {
                avatar: true,
                full_name: true,
                email: true,
                slug: true,
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        updated_at: 'desc',
      },
    });

    return histories.map((h) => {
      const post = h.post;
      const author = h.post.author;
      return {
        readAt: h.created_at,
        post: {
          id: post.id,
          slug: post.slug,
          thumbnailImage: post.thumbnail_image,
          subTitle: post.sub_title,
          title: post.title,
          createdAt: post.created_at,
          updatedAt: post.updated_at,
          author: {
            avatar: author?.avatar,
            fullName: author?.full_name,
            slug: author?.slug,
            email: author?.email,
          },
        },
      };
    });
  }
}
