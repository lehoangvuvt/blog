import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { PostsService } from './posts.service';
import type CreatePostDto from './dtos/create-post.dto';
import type { FindManyPostsDto } from './dtos/find-many-posts.dto';
import type { GetRepliesQueryDto } from 'src/post-comments/dtos/get-replies-query.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { PostCommentsService } from 'src/post-comments/post-comments.service';

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
      page,
      limit,
    );
  }

  @Post('')
  async create(@Body() body: CreatePostDto) {
    return await this.postsService.create(body);
  }
}
