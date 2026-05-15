import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { PostsService } from './posts.service';
import type CreatePostDto from './dtos/create-post.dto';
import type { FindManyPostsDto } from './dtos/find-many-posts.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findMany(@Query() query: FindManyPostsDto) {
    return await this.postsService.findMany(query);
  }

  @Get('/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return await this.postsService.findBySlug(slug);
  }

  @Post('')
  async create(@Body() body: CreatePostDto) {
    return await this.postsService.create(body);
  }
}
