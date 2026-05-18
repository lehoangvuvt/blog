import { Injectable, NotFoundException } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import type RegisterDto from './dtos/register-dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ConfigService } from '@nestjs/config';
// biome-ignore lint/style/useImportType: <explanation>
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  private jwtAccessTokenSecret = '';

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {
    const secret = this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET');
    if (!secret) {
      throw new Error('Missing JWT_ACCESS_TOKEN_SECRET in .env');
    }
    this.jwtAccessTokenSecret = secret;
  }

  verifyToken(token: string) {
    return jwt.verify(token, this.jwtAccessTokenSecret);
  }

  async register(dto: RegisterDto) {
    const { email, password, fullName } = dto;

    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    const response = await this.usersService.create(
      email,
      fullName,
      hashedPassword,
    );

    await this.emailService.sendVerifyEmail(email, '123');

    return {
      fullName: response.full_name,
      email: response.email,
      slug: response.slug,
    };
  }

  async login(dto: RegisterDto) {
    const { email, password } = dto;

    const user = await this.usersService.findOne({ email });

    if (!user) {
      throw new NotFoundException('Email or password not correct');
    }

    const isMatched = await argon2.verify(user.password, password);

    if (!isMatched) {
      throw new NotFoundException('Email or password not correct');
    }

    const payload = { sub: user.id };
    const token = jwt.sign(payload, this.jwtAccessTokenSecret, {
      expiresIn: '1h',
    });

    return {
      token,
      user: {
        fullName: user.full_name,
        avatar: user.avatar,
        email: user.email,
        slug: user.slug,
        createdAt: user.created_at,
      },
    };
  }
}
