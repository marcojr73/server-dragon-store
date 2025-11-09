import { Injectable, NotFoundException } from '@nestjs/common';
import { SquadRepository } from '../repositories/squad-repository';

@Injectable()
export class ListUsersSquad {
  constructor(private readonly repository: SquadRepository) {}

  async execute(squadId: number) {
    const squad = await this.repository.listUsersBySquadId(squadId);
    if (!squad) {
      throw new NotFoundException();
    }
    return {
      id: squad.id,
      squadLeaderId: squad.squadLeaderId,
      usersSquad: squad.squadUsers.map((userSquad) => userSquad.user),
    };
  }
}
