/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// biome-ignore lint/style/useImportType: <explanation>
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return true;
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      return true;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      request['user'] = payload;
    } catch {
      // Invalid token -> ignore and continue
    }

    return true;
  }
}
