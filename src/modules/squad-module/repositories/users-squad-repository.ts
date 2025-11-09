import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma-module/prisma-service';

@Injectable()
export class UsersSquadRepository {
  constructor(private prisma: PrismaService) {}

  private get repository() {
    return this.prisma.userSquads;
  }

  listUsersBySquadId(squadId: number) {
    return this.repository.findMany({
      where: {
        squadId,
      },
      select: {
        user: {
          select: {
            id: true,
            userName: true,
            picture: true,
            email: true,
          },
        },
        squad: {
          select: {
            id: true,
            squadLeaderId: true,
          },
        },
      },
    });
  }
}
