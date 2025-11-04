import { Injectable } from '@nestjs/common';
import { SquadRepository } from './squad-repository';
import { CreateOrUpdateSquadDto } from './squad-dto';
import type { TUser } from '../user-module/interfaces';

@Injectable()
export class SquadUseCase {
  constructor(private readonly squadRepository: SquadRepository) {}

  async getSquadsOrderedByScore() {
    const squads = await this.squadRepository.getSquadsWithCurrentMonthScores();
    return squads
      .map((squad) => {
        const score = squad.squadScores.reduce(
          (acc, curr) => acc + curr.score,
          0,
        );
        const { squadScores, ...response } = squad;
        return { ...response, score };
      })
      .sort((a, b) => b.score - a.score);
  }

  async create(createOrUpdateSquadDto: CreateOrUpdateSquadDto, user: TUser) {
    return this.squadRepository.create({
      name: createOrUpdateSquadDto.name,
      description: createOrUpdateSquadDto.description,
      color: createOrUpdateSquadDto.color,
      logo: createOrUpdateSquadDto.logo,
      organizationId: user.organizationId,
    });
  }
}
