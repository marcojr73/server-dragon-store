import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SquadRepository } from '../repositories/squad-repository';
import { TSession } from '../../user-module/interfaces';

@Injectable()
export class ListSquadUser {
  constructor(private readonly repository: SquadRepository) {}

  async execute(userId: number, session: TSession) {
    const squadsUser = await this.repository.listSquadUser(userId);
    for (const squadUser of squadsUser) {
      if (squadUser.user.organizationId !== session.organizationId) {
        throw new ForbiddenException('Usuário não pertence a esta organização');
      }
    }
    if (!squadsUser) {
      throw new NotFoundException();
    }

    return squadsUser;
  }
}
