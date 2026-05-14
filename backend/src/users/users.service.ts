import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, User } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findMany(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findOne(options: {
    email?: string;
    password?: string;
    isActive?: boolean;
  }): Promise<User | null> {
    const { email, password } = options;
    return await this.prisma.user.findFirst({
      where: {
        ...(email && { email }),
        ...(password && { password }),
      },
    });
  }

  async create(email: string, password: string): Promise<User> {
    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          password,
        },
      });

      return user;
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new BadRequestException('Email already exists');
      }

      throw err;
    }
  }
}
