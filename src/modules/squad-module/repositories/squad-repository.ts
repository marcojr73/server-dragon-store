import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma-module/prisma-service';
import { squads } from '@prisma/client';

@Injectable()
export class SquadRepository {
  constructor(private prisma: PrismaService) {}

  private get squads() {
    return this.prisma.squads;
  }

  private get userSquads() {
    return this.prisma.userSquads;
  }

  create(
    data: Partial<squads> & { organizationId: number } & { name: string },
  ) {
    return this.squads.create({
      data,
    });
  }

  update(data: Partial<squads>, id: number) {
    return this.squads.update({
      where: {
        id,
      },
      data,
    });
  }

  getSquadsWithCurrentMonthScores(organizationId?: number) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );
    return this.prisma.squads.findMany({
      where: {
        organizationId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        logo: true,
        squadLeaderId: true,
        squadScores: {
          select: {
            score: true,
          },
          where: {
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        },
      },
    });
  }

  createSquadScore(data: {
    score: number;
    squadId: number;
    organizationId: number;
  }) {
    return this.prisma.squadScores.create({
      data,
    });
  }

  listUsersBySquadId(id: number) {
    return this.squads.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        squadLeaderId: true,
        squadUsers: {
          select: {
            user: {
              select: {
                id: true,
                userName: true,
                picture: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  createUserSquad(squadId: number, userId: number) {
    return this.userSquads.create({
      data: {
        squadId,
        userId,
      },
    });
  }

  deleteUserSquad(squadId: number, userId: number) {
    return this.userSquads.deleteMany({
      where: {
        squadId,
        userId,
      },
    });
  }
}
