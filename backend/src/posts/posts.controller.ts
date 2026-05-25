/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { PostsService } from './posts.service';
import CreatePostDto from './dtos/create-post.dto';
import { FindManyPostsDto } from './dtos/find-many-posts.dto';
import { GetRepliesQueryDto } from 'src/post-comments/dtos/get-replies-query.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { PostCommentsService } from 'src/post-comments/post-comments.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-guard';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postCommentsService: PostCommentsService,
  ) {}

  @Get()
  async findMany(@Query() query: FindManyPostsDto) {
    return await this.postsService.findMany(query);
  }

  @Get('/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return await this.postsService.findBySlug(slug);
  }

  @Get('/:postId/comments')
  async getPostComments(
    @Param('postId') postId: string,
    @Query() query: GetRepliesQueryDto,
  ) {
    const { limit = 5, page = 1 } = query;
    return await this.postCommentsService.getCommentsByPostId(
      Number.parseInt(postId),
      Number.parseInt(page.toString()),
      Number.parseInt(limit.toString()),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  async create(
    @Body() body: CreatePostDto,
    @CurrentUser()
    user: {
      sub: string;
    },
  ) {
    return await this.postsService.create(user.sub, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':postId/like')
  like(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser()
    user: {
      sub: string;
    },
  ) {
    return this.postsService.like(postId, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':postId/like')
  unlike(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser()
    user: {
      sub: string;
    },
  ) {
    return this.postsService.unlike(postId, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':postId/repost')
  repost(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser()
    user: {
      sub: string;
    },
  ) {
    return this.postsService.repost(postId, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':postId/repost')
  unRepost(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser()
    user: {
      sub: string;
    },
  ) {
    return this.postsService.unRepost(postId, user.sub);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':postId/statistics')
  async getPostStatistics(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user?: { sub: string },
  ) {
    return this.postsService.getPostStatistics(postId, user?.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':postId/save')
  async savePost(
    @CurrentUser() user: { sub: string },
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return await this.postsService.savePost(user.sub, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':postId/save')
  async unsavePost(
    @CurrentUser() user: { sub: string },
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return await this.postsService.unsavePost(user.sub, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':postId/read')
  async updateReadingHistory(
    @CurrentUser() user: { sub: string },
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    await this.postsService.updateUserReadingHistory(user.sub, postId);
    return { success: true };
  }
}
