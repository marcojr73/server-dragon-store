import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-module/prisma-service';
import { products } from '@prisma/client';

@Injectable()
export class ProductsRepository {
  constructor(private prisma: PrismaService) {}

  listProductsByOrganizationId(organizationId: number) {
    return this.prisma.products.findMany({
      where: {
        store: {
          organizationId,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        value: true,
        picture: true,
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

  update(id: number, data: Partial<products>) {
    return this.prisma.products.update({
      where: {
        id,
      },
      data,
    });
  }

  create(data: Omit<products, 'id' | 'createdAt'> & { storeId: number }) {
    return this.prisma.products.create({
      data,
    });
  }

  deleteProduct(productId: number) {
    return this.prisma.products.delete({
      where: {
        id: productId,
      },
    });
  }
}
