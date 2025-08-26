import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-module/prisma-service';
import { organizations } from '@prisma/client';

@Injectable()
export class OrganizationRepository {
  constructor(private prisma: PrismaService) {}

  findFirst(data: any) {
    return this.prisma.organizations.findFirst({
      where: data,
    });
  }

  update(data: Partial<organizations> & { id: organizations['id'] }) {
    return this.prisma.organizations.update({
      where: {
        id: data.id,
      },
      data: data,
    });
  }
}
