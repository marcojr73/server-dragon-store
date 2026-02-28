import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma-module/prisma-service';
import { exchanges } from '@prisma/client';

@Injectable()
export class ExchangeRepository {
  constructor(private prisma: PrismaService) {}

  create({
    userId,
    employeeId,
    value,
    message,
  }: Omit<exchanges, 'id' | 'createdAt'>) {
    return this.prisma.exchanges.create({
      data: {
        userId,
        employeeId,
        message,
        value,
      },
    });
  }

  getExchangesFromDate(organizationId: number, startDate: Date) {
    return this.prisma.exchanges.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
        user: {
          organizationId,
        },
      },
      select: {
        id: true,
        userId: true,
        employeeId: true,
        value: true,
        message: true,
      },
    });
  }
}
