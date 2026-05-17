/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Get, Param, Query } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { PostCommentsService } from './post-comments.service';
import type { GetRepliesQueryDto } from './dtos/get-replies-query.dto';

@Controller('post-comments')
export class PostCommentsController {
  constructor(private readonly postCommentsService: PostCommentsService) {}

  @Get('/comments/:commentId/replies')
  async getReplies(
    @Param('commentId') commentId: string,
    @Query() query: GetRepliesQueryDto,
  ) {
    return await this.postCommentsService.getReplies(commentId, query);
  }
}
