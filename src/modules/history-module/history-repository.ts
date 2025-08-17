import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-module/prisma-service';
import { history } from '@prisma/client';

@Injectable()
export class HistoryRepository {
  constructor(private prisma: PrismaService) {}

  findMany(
    { organizationId }: Omit<history, 'id' | 'createdAt' | 'exchangeId'>,
    userId?: number,
  ) {
    return this.prisma.history.findMany({
      select: {
        id: true,
        exchange: {
          select: {
            id: true,
            userId: true,
            user: {
              select: {
                id: true,
                userName: true,
                picture: true,
                email: true,
              },
            },
            employee: {
              select: {
                id: true,
                userName: true,
                picture: true,
                email: true,
              },
            },
            value: true,
            message: true,
          },
        },
      },
      where: {
        organizationId,
        ...(userId && {
          exchange: {
            OR: [{ userId: userId }, { employeeId: userId }],
          },
        }),
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  create({ organizationId, exchangeId }: Omit<history, 'id' | 'createdAt'>) {
    return this.prisma.history.create({
      data: {
        exchangeId,
        organizationId,
      },
    });
  }
}
