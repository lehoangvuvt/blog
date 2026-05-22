import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import type CreatePostCollectionDto from './dtos/create-post-collection.dto';
import { generateSlug } from 'src/shared/utils';

@Injectable()
export class PostCollectionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: string, dto: CreatePostCollectionDto) {
    const { description, name } = dto;

    return await this.prismaService.postCollections.create({
      data: {
        name,
        description,
        creator_id: userId,
        slug: generateSlug(name),
      },
    });
  }

  async delete(userId: string, collectionId: string) {
    const collection = await this.prismaService.postCollections.findFirst({
      where: {
        id: collectionId,
      },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (userId !== collection.creator_id) {
      throw new ForbiddenException("Not collection's creator");
    }

    return await this.prismaService.postCollections.delete({
      where: {
        id: collectionId,
      },
    });
  }

  async getCollectionDetails(slug: string) {
    const c = await this.prismaService.postCollections.findFirst({
      where: {
        slug,
      },
      include: {
        postCollectionItems: {
          select: {
            post: {
              select: {
                id: true,
                author: true,
                title: true,
                sub_title: true,
                thumbnail_image: true,
                created_at: true,
                slug: true,
                html_content: true,
              },
            },
          },
        },
      },
    });

    if (!c) {
      throw new NotFoundException('Collection not found');
    }

    return {
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      createdAt: c.created_at,
      posts: c.postCollectionItems.map((item) => {
        return {
          id: item.post.id,
          title: item.post.title,
          subTitle: item.post.sub_title,
          thumbnailImage: item.post.thumbnail_image,
          author: item.post.author,
          postedDate: item.post.created_at,
          slug: item.post.slug,
          htmlContent: item.post.html_content,
        };
      }),
    };
  }

  async addPostToCollection(
    creatorId: string,
    postId: number,
    collectionId: string,
  ) {
    const collection = await this.prismaService.postCollections.findFirst({
      where: {
        id: collectionId,
      },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (collection.creator_id !== creatorId) {
      throw new ForbiddenException("Not collection's creator");
    }

    return await this.prismaService.postCollectionItems.upsert({
      where: {
        post_id_collection_id: {
          post_id: postId,
          collection_id: collectionId,
        },
      },
      update: {},
      create: {
        collection_id: collectionId,
        post_id: postId,
      },
    });
  }

  async removePostFromCollection(
    creatorId: string,
    postId: number,
    collectionId: string,
  ) {
    const collection = await this.prismaService.postCollections.findFirst({
      where: {
        id: collectionId,
      },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (collection.creator_id !== creatorId) {
      throw new ForbiddenException("Not collection's creator");
    }

    return await this.prismaService.postCollectionItems.delete({
      where: {
        post_id_collection_id: {
          post_id: postId,
          collection_id: collectionId,
        },
      },
    });
  }

  async getCollectionsByCreatorId(creatorId: string) {
    const collections = await this.prismaService.postCollections.findMany({
      where: {
        creator_id: creatorId,
      },
      include: {
        postCollectionItems: {
          select: {
            post: {
              select: {
                id: true,
                author: true,
                title: true,
                thumbnail_image: true,
                created_at: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    return collections.map((c) => {
      return {
        id: c.id,
        slug: c.slug,
        name: c.name,
        description: c.description,
        createdAt: c.created_at,
        posts: c.postCollectionItems.map((item) => {
          return {
            id: item.post.id,
            title: item.post.title,
            thumbnailImage: item.post.thumbnail_image,
            author: item.post.author,
            postedDate: item.post.created_at,
            slug: item.post.slug,
          };
        }),
      };
    });
  }
}
