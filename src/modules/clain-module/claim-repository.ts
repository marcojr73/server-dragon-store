import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/prisma-module/prisma-service';

@Injectable()
export class ClaimRepository {
  constructor(private prisma: PrismaService) {}

  get repository() {
    return this.prisma.claims;
  }

  create(productId: number, userId: number) {
    return this.repository.create({
      data: {
        productId,
        userId,
      },
    });
  }

  listByOrganization(organizationId: number, startAt?: Date) {
    return this.repository.findMany({
      where: {
        user: {
          organizationId,
        },
        createdAt: {
          gt: startAt,
        },
      },
      select: {
        product: true,
        user: true,
        createdAt: true,
      },
    });
  }
}
