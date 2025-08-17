import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-module/prisma-service';

@Injectable()
export class SquadRepository {
  constructor(private prisma: PrismaService) {}

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
}
