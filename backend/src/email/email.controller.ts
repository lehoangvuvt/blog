import { Controller } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
}
