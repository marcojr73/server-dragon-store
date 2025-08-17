import { Injectable } from '@nestjs/common';
import { SquadRepository } from './squad-repository';

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
}
