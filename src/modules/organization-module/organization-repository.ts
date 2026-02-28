import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma-module/prisma-service';
import { organizations } from '@prisma/client';
import { UpdateOrganizationDto } from './dtos/update-organization-dto';

@Injectable()
export class OrganizationRepository {
  constructor(private prisma: PrismaService) {}

  findFirst(data?: Partial<organizations>) {
    return this.prisma.organizations.findFirst({
      where: data,
    });
  }

  update(data: UpdateOrganizationDto, id: number) {
    return this.prisma.organizations.update({
      where: {
        id,
      },
      data: data,
    });
  }
}
