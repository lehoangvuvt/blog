import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import CreatePostDto from './dtos/create-post.dto';
import { FindManyPostsDto } from './dtos/find-many-posts.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findMany(@Query() query: FindManyPostsDto) {
    return await this.postsService.findMany(query);
  }

  @Post('')
  async create(@Body() body: CreatePostDto) {
    return await this.postsService.create(body);
  }
}
