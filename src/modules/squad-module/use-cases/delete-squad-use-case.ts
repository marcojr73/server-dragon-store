import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SquadRepository } from '../repositories/squad-repository';
import { TSession } from '../../user-module/interfaces';

@Injectable()
export class DeleteSquadUseCase {
  constructor(private readonly repository: SquadRepository) {}

  async validateSquadBelongsToUserOrganization(
    squadId: number,
    organizationId: number,
  ) {
    const squad = await this.repository.list({
      id: squadId,
    });
    if (!squad) {
      throw new NotFoundException('Squad not found');
    }
    if (squad.organizationId !== organizationId) {
      throw new UnauthorizedException('Squad does not belong to organization');
    }
  }

  async execute(squadId: number, user: TSession) {
    await this.validateSquadBelongsToUserOrganization(
      squadId,
      user.organizationId,
    );
    return this.repository.delete(squadId);
  }
}
