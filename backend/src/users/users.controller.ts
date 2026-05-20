import { Controller, Get, Param, Query } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { UsersService } from './users.service';
import type { FindManyPostsDto } from 'src/posts/dtos/find-many-posts.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  async findMany() {
    const users = await this.usersService.findMany();
    return { users };
  }

  @Get('/:slug')
  async getUserInfoBySlug(@Param('slug') slug: string) {
    return await this.usersService.getUserInfoBySlug(slug);
  }

  @Get('/:userId/posts')
  async findUserPosts(@Query() query: FindManyPostsDto) {
    return await this.usersService.findUserPosts(query);
  }
}
