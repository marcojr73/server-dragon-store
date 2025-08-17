import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-module/prisma-service';

@Injectable()
export class OrganizationRepository {
  constructor(private prisma: PrismaService) {}

  findOrganization(data: any) {
    return this.prisma.organizations.findFirst({
      where: data,
    });
  }
}
