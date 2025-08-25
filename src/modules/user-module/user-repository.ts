import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-module/prisma-service';
import { users } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  findByGoogleId(googleId: string) {
    return this.prisma.users.findFirst({
      where: {
        googleId,
      },
    });
  }

  findByMicrosoftId(microsoftId: string) {
    return this.prisma.users.findFirst({
      where: {
        microsoftId,
      },
    });
  }

  getUser(data: Partial<users>) {
    return this.prisma.users.findFirst({
      where: data,
      select: {
        id: true,
        userName: true,
        email: true,
        picture: true,
        coins: true,
        gas: true,
        isAdmin: true,
        userSquads: {
          select: {
            squad: {
              select: { id: true },
            },
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  getAuthUser(data: Partial<users>) {
    return this.prisma.users.findFirst({
      where: data,
      select: {
        id: true,
        userName: true,
        email: true,
        isAdmin: true,
        password: true,
        organization: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  getBalance(data: Partial<users>) {
    return this.prisma.users.findFirst({
      where: data,
      select: {
        id: true,
        coins: true,
        gas: true,
      },
    });
  }

  getEmployees(userId: number, organizationId: number, search: string) {
    return this.prisma.users.findMany({
      where: {
        NOT: {
          id: userId,
        },
        organizationId: organizationId,
        userName: {
          contains: search,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        userName: true,
        picture: true,
        email: true,
      },
    });
  }

  create(data: Omit<users, 'id' | 'coins' | 'gas' | 'createdAt' | 'isAdmin'>) {
    return this.prisma.users.create({
      data,
    });
  }

  update(
    { gas, coins, organizationId, userName, picture, email }: Partial<users>,
    userId: number,
  ) {
    return this.prisma.users.update({
      data: {
        coins,
        gas,
        organizationId,
        userName,
        picture,
        email,
      },
      where: { id: userId },
    });
  }
}
