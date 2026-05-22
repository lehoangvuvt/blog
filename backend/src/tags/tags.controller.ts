import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

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

  @Post(':tagId/follow')
  followTag(@CurrentUser('id') userId: string, @Param('tagId') tagId: string) {
    return this.tagsService.followTag(userId, tagId);
  }

  @Delete(':tagId/follow')
  unfollowTag(
    @CurrentUser('id') userId: string,
    @Param('tagId') tagId: string,
  ) {
    return this.tagsService.unfollowTag(userId, tagId);
  }
}
