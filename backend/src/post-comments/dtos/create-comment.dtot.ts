import { IsNumber, IsOptional, IsString } from 'class-validator';

export default class CreateCommentDto {
  @IsNumber()
  postId: number;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  replyToCommentId?: string;
}
