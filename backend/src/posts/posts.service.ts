import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import CreatePostDto from './dtos/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreatePostDto) {
    const { content, title, subTitle, published, tags } = dto;
    return await this.prismaService.post.create({
      data: {
        title,
        sub_title: subTitle,
        content,
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
