import { BadRequestException, Injectable } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class FilesService {
  constructor(private readonly configService: ConfigService) {}

  private readonly allowedMimeTypes = [
    'image/png',
    'image/jpeg',
    'application/pdf',
  ];

  async generatePresignedUrl(fileName: string, mimeType: string) {
    if (!this.allowedMimeTypes.includes(mimeType)) {
      throw new BadRequestException('Invalid file type');
    }

    const region = this.configService.get<string>('AWS_S3_REGION') ?? '';
    const bucket = this.configService.get<string>('AWS_S3_BUCKET') ?? '';
    const cloudFrontUrl =
      this.configService.get<string>('AWS_CLOUD_FRONT_URL') ?? '';

    const client = new S3Client({
      region,
      credentials: {
        accessKeyId:
          this.configService.get<string>('AWS_S3_ACCESS_KEY_ID') ?? '',
        secretAccessKey:
          this.configService.get<string>('AWS_S3_SECRET_ACCESS_KEY') ?? '',
      },
    });

    const key = `uploads/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: mimeType,
    });

    const url = await getSignedUrl(client, command, {
      expiresIn: 3600,
    });

    const publicUrl = `${cloudFrontUrl}/${key}`;

    return {
      url,
      key,
      publicUrl,
    };
  }
}
