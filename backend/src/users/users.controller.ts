import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { FindManyPostsDto } from 'src/posts/dtos/find-many-posts.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  async findMany() {
    const users = await this.usersService.findMany();
    return { users };
  }

  @Get('/:userId/posts')
  async findUserPosts(@Query() query: FindManyPostsDto) {
    return await this.usersService.findUserPosts(query);
  }
}
