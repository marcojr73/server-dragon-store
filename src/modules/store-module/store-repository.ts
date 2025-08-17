import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-module/prisma-service';

@Injectable()
export class StoreRepository {
  constructor(private prisma: PrismaService) {}

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

  getProductById(id: number) {
    return this.prisma.products.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        value: true,
        picture: true,
        store: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}
