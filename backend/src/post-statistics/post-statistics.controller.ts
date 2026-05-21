/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostStatisticsService } from './post-statistics.service';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('post-statistics')
export class PostStatisticsController {
  constructor(private readonly postStatisticsService: PostStatisticsService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':postId/statistics')
  async getPostStatistics(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user?: { sub: string },
  ) {
    return this.postStatisticsService.getPostStatistics(postId, user?.sub);
  }

  @Get('trending/daily')
  async getTrendingPostsDaily(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.postStatisticsService.getTrendingPostsDaily(limit);
  }

  @Get('trending/weekly')
  async getTrendingPostsWeekly(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.postStatisticsService.getTrendingPostsWeekly(limit);
  }

  @Get('trending/monthly')
  async getTrendingPostsMonthly(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.postStatisticsService.getTrendingPostsMonthly(limit);
  }
}
