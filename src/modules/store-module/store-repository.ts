import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-module/prisma-service';

@Injectable()
export class StoreRepository {
  constructor(private prisma: PrismaService) {}

  findByOrganizationIdOrFail(organizationId: number) {
    return this.prisma.store.findFirstOrThrow({
      where: {
        organizationId,
      },
      select: {
        id: true,
      },
    });
  }

  listProductsOfStoreByOrganizationId(organizationId: number) {
    return this.prisma.store.findFirst({
      where: {
        organizationId,
      },
      select: {
        id: true,
        products: {
          select: {
            id: true,
            name: true,
            description: true,
            value: true,
            picture: true,
          },
        },
      },
    });
  }
}
