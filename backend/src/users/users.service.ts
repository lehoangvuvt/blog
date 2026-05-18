import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, type User } from 'generated/prisma/client';
import type { FindManyPostsDto } from 'src/posts/dtos/find-many-posts.dto';
import { PostsService } from 'src/posts/posts.service';
import { PrismaService } from 'src/prisma.service';
import { generateSlug } from 'src/shared/utils';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private postsService: PostsService,
  ) {}

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
}
