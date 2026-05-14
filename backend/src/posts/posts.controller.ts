import { Body, Controller, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import CreatePostDto from './dtos/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('')
  async create(@Body() body: CreatePostDto) {
    return await this.postsService.create(body);
  }
}
