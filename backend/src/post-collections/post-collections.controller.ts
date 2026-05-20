import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostCollectionsService } from './post-collections.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import CreatePostCollectionDto from './dtos/create-post-collection.dto';

@Controller('post-collections')
export class PostCollectionsController {
  constructor(
    private readonly postCollectionsService: PostCollectionsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getUserCollections(
    @CurrentUser()
    user: {
      sub: string;
    },
  ) {
    return await this.postCollectionsService.getCollectionsByCreatorId(
      user.sub,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  async create(
    @Body() body: CreatePostCollectionDto,
    @CurrentUser()
    user: {
      sub: string;
    },
  ) {
    return await this.postCollectionsService.create(user.sub, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:collectionId')
  async detele(
    @Param('collectionId') collectionId: string,
    @CurrentUser() user: { sub: string },
  ) {
    return await this.postCollectionsService.delete(user.sub, collectionId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':collectionId/posts/:postId')
  async addPostToCollection(
    @CurrentUser() user: { sub: string },
    @Param('postId', ParseIntPipe) postId: number,
    @Param('collectionId') collectionId: string,
  ) {
    return await this.postCollectionsService.addPostToCollection(
      user.sub,
      postId,
      collectionId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':collectionId/posts/:postId')
  async removePostFromCollection(
    @CurrentUser() user: { sub: string },
    @Param('postId', ParseIntPipe) postId: number,
    @Param('collectionId') collectionId: string,
  ) {
    return await this.postCollectionsService.removePostFromCollection(
      user.sub,
      postId,
      collectionId,
    );
  }
}
