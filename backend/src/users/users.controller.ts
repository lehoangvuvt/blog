import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { UsersService } from './users.service';
import type { FindManyPostsDto } from 'src/posts/dtos/find-many-posts.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

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

  @Get('/:slug/reposted-posts')
  async getUserRepostedPostsBySlug(@Param('slug') slug: string) {
    return await this.usersService.getUserRepostedPostsBySlug(slug);
  }

  @Get('/:slug/liked-posts')
  async getUserLikedPostsBySlug(@Param('slug') slug: string) {
    return await this.usersService.getUserLikedPostsBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me/saved-posts')
  async getCurrentUserSavedPosts(
    @CurrentUser()
    user: {
      sub: string;
    },
  ) {
    return await this.usersService.getUserSavedPosts(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':targetUserId/follow')
  async followAUser(
    @CurrentUser()
    user: {
      sub: string;
    },
    @Param('targetUserId') targetUserId: string,
  ) {
    return await this.usersService.followUser(user.sub, targetUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':targetUserId/follow')
  async unfollowAUser(
    @CurrentUser()
    user: {
      sub: string;
    },
    @Param('targetUserId') targetUserId: string,
  ) {
    return await this.usersService.unfollowUser(user.sub, targetUserId);
  }
}
