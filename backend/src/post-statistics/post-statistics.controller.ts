/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  BadRequestException,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostStatisticsService } from './post-statistics.service';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Request } from 'express';
import { isIP } from 'net';

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

  @Post(':postId/view')
  async increaseView(
    @Param('postId', ParseIntPipe) postId: number,
    @Req() req: Request,
  ) {
    const forwardedFor = req.headers['x-forwarded-for'];

    let ipAddress: string | undefined;

    if (typeof forwardedFor === 'string') {
      ipAddress = forwardedFor.split(',')[0]?.trim();
    }

    if (!ipAddress) {
      ipAddress = req.ip ?? undefined;
    }

    if (!ipAddress || isIP(ipAddress) === 0) {
      throw new BadRequestException('Invalid IP address');
    }

    const userAgent = req.headers['user-agent'];

    return this.postStatisticsService.increaseView(
      postId,
      ipAddress,
      userAgent,
    );
  }
}
