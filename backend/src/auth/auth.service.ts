/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import RegisterDto from './dtos/register.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { ConfigService } from '@nestjs/config';
// biome-ignore lint/style/useImportType: <explanation>
import { EmailService } from 'src/email/email.service';
import { CreatePendingRegistrationDto } from './dtos/create-pending-registration.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from 'src/prisma.service';
import { createHash, randomBytes } from 'node:crypto';
import { addMinutes } from 'date-fns';
import LoginDto from './dtos/login.dto';

@Injectable()
export class AuthService {
  private jwtAccessTokenSecret = '';

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {
    const secret = this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET');
    if (!secret) {
      throw new Error('Missing JWT_ACCESS_TOKEN_SECRET in .env');
    }
    this.jwtAccessTokenSecret = secret;
  }

  private async _getHashedPassword(password: string) {
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    return hashedPassword;
  }

  verifyToken(token: string) {
    return jwt.verify(token, this.jwtAccessTokenSecret);
  }

  async createPendingRegistration(dto: CreatePendingRegistrationDto) {
    const email = dto.email.trim().toLowerCase();

    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const rawToken = randomBytes(32).toString('hex');

    const hashedToken = createHash('sha256').update(rawToken).digest('hex');

    await this.prismaService.pendingRegistration.create({
      data: {
        email,
        hashed_token: hashedToken,
        expires_at: addMinutes(new Date(), 30),
      },
    });

    await this.emailService.sendVerifyEmail(email, rawToken);

    return {
      message: 'Verification email sent',
    };
  }

  async checkVerifyEmailToken(token: string) {
    const hashedToken = createHash('sha256').update(token).digest('hex');

    const verification =
      await this.prismaService.pendingRegistration.findUnique({
        where: {
          hashed_token: hashedToken,
        },
      });

    if (!verification) {
      throw new BadRequestException('Invalid verification token');
    }

    if (verification.expires_at < new Date()) {
      throw new BadRequestException('Verification token expired');
    }

    if (verification.verified_at) {
      return {
        message: 'Email already verified',
        email: verification.email,
        status: 'already_verified',
      };
    }

    return {
      message: 'Verification token valid',
      email: verification.email,
      status: 'valid',
    };
  }

  async verifyEmail(token: string) {
    const hashedToken = createHash('sha256').update(token).digest('hex');

    const verification =
      await this.prismaService.pendingRegistration.findUnique({
        where: {
          hashed_token: hashedToken,
        },
      });

    if (!verification) {
      throw new BadRequestException('Invalid verification token');
    }

    if (verification.expires_at < new Date()) {
      throw new BadRequestException('Verification token expired');
    }

    if (verification.verified_at) {
      return {
        message: 'Email already verified',
        email: verification.email,
      };
    }

    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email: verification.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const updatedVerification =
      await this.prismaService.pendingRegistration.update({
        where: {
          id: verification.id,
        },
        data: {
          verified_at: new Date(),
        },
      });

    return {
      message: 'Email verified successfully',
      email: updatedVerification.email,
    };
  }

  async createPendingResetPasswordRequest(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.prismaService.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (!user) {
      return {
        message:
          'If an account with that email exists, a reset link has been sent.',
      };
    }
    await this.prismaService.pendingResetPasswordRequest.deleteMany({
      where: { user_id: user.id, used_at: null },
    });
    const rawToken = randomBytes(32).toString('hex');
    const hashedToken = createHash('sha256').update(rawToken).digest('hex');
    await this.prismaService.pendingResetPasswordRequest.create({
      data: {
        user_id: user.id,
        hashed_token: hashedToken,
        expires_at: addMinutes(new Date(), 30),
      },
    });
    await this.emailService.sendResetPasswordEmail(normalizedEmail, rawToken);
    return {
      message:
        'If an account with that email exists, a reset link has been sent.',
    };
  }

  async checkResetPasswordToken(token: string) {
    const hashedToken = createHash('sha256').update(token).digest('hex');

    const resetRequest =
      await this.prismaService.pendingResetPasswordRequest.findUnique({
        where: {
          hashed_token: hashedToken,
        },
        include: {
          user: true,
        },
      });

    if (!resetRequest) {
      throw new BadRequestException('Invalid reset password token');
    }

    if (resetRequest.expires_at < new Date()) {
      throw new BadRequestException('Reset password token expired');
    }

    if (resetRequest.used_at) {
      throw new BadRequestException('Reset password link already used');
    }

    return {
      message: 'Reset password token valid',
      user: {
        id: resetRequest.user.id,
        email: resetRequest.user.email,
      },
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const hashedToken = createHash('sha256').update(token).digest('hex');

    const resetRequest =
      await this.prismaService.pendingResetPasswordRequest.findUnique({
        where: {
          hashed_token: hashedToken,
        },
        include: {
          user: true,
        },
      });

    if (!resetRequest) {
      throw new BadRequestException('Invalid reset password token');
    }

    if (resetRequest.expires_at < new Date()) {
      throw new BadRequestException('Reset password token expired');
    }

    if (resetRequest.used_at) {
      throw new BadRequestException('Reset password link already used');
    }

    const hashedPassword = await this._getHashedPassword(newPassword);

    await this.prismaService.$transaction([
      this.prismaService.user.update({
        where: {
          id: resetRequest.user_id,
        },
        data: {
          password: hashedPassword,
        },
      }),

      this.prismaService.pendingResetPasswordRequest.update({
        where: {
          id: resetRequest.id,
        },
        data: {
          used_at: new Date(),
        },
      }),
    ]);

    return {
      message: 'Password reset successfully',
    };
  }

  async register(dto: RegisterDto) {
    const { token, password, fullName } = dto;

    const hashedToken = createHash('sha256').update(token).digest('hex');

    const verification =
      await this.prismaService.pendingRegistration.findUnique({
        where: {
          hashed_token: hashedToken,
        },
      });

    if (!verification) {
      throw new BadRequestException('Invalid verification token');
    }

    if (verification.expires_at < new Date()) {
      throw new BadRequestException('Verification token expired');
    }

    if (!verification.verified_at) {
      throw new BadRequestException('Email is not verified');
    }

    const existingUser = await this.usersService.findOne({
      email: verification.email,
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await this._getHashedPassword(password);

    const response = await this.usersService.create(
      verification.email,
      fullName,
      hashedPassword,
    );

    await this.prismaService.pendingRegistration.delete({
      where: {
        id: verification.id,
      },
    });

    return {
      fullName: response.full_name,
      email: response.email,
      slug: response.slug,
    };
  }

  async getMe(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        full_name: true,
        avatar: true,
        created_at: true,
        introduction: true,
        slug: true,
        background_image: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const followers = await this.usersService.getUserFollowers(userId);
    const followings = await this.usersService.getUserFollowings(userId);
    const savedPosts = await this.usersService.getUserSavedPosts(userId);
    const savedPostIds = savedPosts.map((p) => p.id);
    const followedTagIds = await this.prismaService.tagFollow.findMany({
      where: {
        user_id: userId,
      },
      select: {
        tag_id: true,
        is_email_notify: true,
      },
    });

    return {
      id: user.id,
      emai: user.email,
      fullName: user.full_name,
      avatar: user.avatar,
      createdAt: user.created_at,
      introduction: user.introduction,
      slug: user.slug,
      backgroundImage: user.background_image,
      followers,
      followings,
      savedPostIds,
      followedTags: followedTagIds.map((tag) => {
        return {
          id: tag.tag_id,
          isEmailNotify: tag.is_email_notify,
        };
      }),
    };
  }

  async login(dto: LoginDto) {
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
      expiresIn: '7d',
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
