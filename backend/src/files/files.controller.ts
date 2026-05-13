import { Body, Controller, Post } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload-url')
  async getPresignedUrl(@Body() body: { fileName: string; mimeType: string }) {
    const { fileName, mimeType } = body;
    const response = await this.filesService.generatePresignedUrl(
      fileName,
      mimeType,
    );
    return response;
  }
}
