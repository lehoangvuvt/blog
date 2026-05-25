import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { PostCommentsService } from './post-comments.service';
import { GetRepliesQueryDto } from './dtos/get-replies-query.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import CreateCommentDto from './dtos/create-comment.dtot';

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

  @UseGuards(JwtAuthGuard)
  @Post('')
  async create(
    @CurrentUser()
    user: {
      sub: string;
    },
    @Body() body: CreateCommentDto,
  ) {
    return await this.postCommentsService.create(user.sub, body);
  }
}
