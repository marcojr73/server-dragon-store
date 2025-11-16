import { Injectable } from '@nestjs/common';
import { SquadRepository } from '../repositories/squad-repository';
import type { TSession } from '../../user-module/interfaces';
import { CreateSquadDto } from '../dtos/create-squad-dto';

@Injectable()
export class SquadUseCase {
  constructor(private readonly squadRepository: SquadRepository) {}

  async getSquadsOrderedByScore() {
    const squads = await this.squadRepository.getSquadsWithCurrentMonthScores();
    console.log(squads);
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

  async create(createOrUpdateSquadDto: CreateSquadDto, user: TSession) {
    return this.squadRepository.create({
      name: createOrUpdateSquadDto.name,
      description: createOrUpdateSquadDto.description,
      color: createOrUpdateSquadDto.color,
      logo: createOrUpdateSquadDto.logo,
      squadLeaderId: createOrUpdateSquadDto.squadLeaderId,
      organizationId: user.organizationId,
    });
  }

  async update(createOrUpdateSquadDto: CreateSquadDto, id: number) {
    return this.squadRepository.update(
      {
        name: createOrUpdateSquadDto.name,
        description: createOrUpdateSquadDto.description,
        color: createOrUpdateSquadDto.color,
        logo: createOrUpdateSquadDto.logo,
        squadLeaderId: createOrUpdateSquadDto.squadLeaderId,
      },
      id,
    );
  }
}
