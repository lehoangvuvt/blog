import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get('')
  async findMany(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number,

    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number,

    @Query('search')
    search?: string,

    @Query('ids')
    ids?: string,
  ) {
    return await this.tagsService.findMany(page, limit, search, ids);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':tagId/follow')
  followTag(
    @CurrentUser() user: { sub: string },
    @Param('tagId') tagId: string,
  ) {
    return this.tagsService.followTag(user.sub, tagId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':tagId/follow')
  unfollowTag(
    @CurrentUser() user: { sub: string },
    @Param('tagId') tagId: string,
  ) {
    return this.tagsService.unfollowTag(user.sub, tagId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':tagId/follow/email-notify')
  turnOnTagEmailNotify(
    @CurrentUser() user: { sub: string },
    @Param('tagId') tagId: string,
  ) {
    return this.tagsService.toggleTagFollowEmailNotify(user.sub, tagId, 'on');
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':tagId/follow/email-notify')
  turnOffTagEmailNotify(
    @CurrentUser() user: { sub: string },
    @Param('tagId') tagId: string,
  ) {
    return this.tagsService.toggleTagFollowEmailNotify(user.sub, tagId, 'off');
  }
}
