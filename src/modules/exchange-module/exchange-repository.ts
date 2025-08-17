import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-module/prisma-service';
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
}
