import { BadRequestException, Injectable } from '@nestjs/common';
import { SquadRepository } from '../repositories/squad-repository';
import { TSession } from '../../user-module/interfaces';
import { UserRepository } from '../../user-module/user-repository';

@Injectable()
export class RemoveUserSquadUseCase {
  constructor(
    private readonly squadRepository: SquadRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(squadId: number, userId: number, user: TSession) {
    const userToRemove = await this.userRepository.getUser({ id: userId });

    if (!userToRemove) {
      throw new BadRequestException('User does not exist');
    }

    if (
      !this.isUserFromOrganization(
        user.organizationId,
        userToRemove.organizationId,
      )
    ) {
      throw new BadRequestException('User does not belong to organization');
    }

    return this.squadRepository.deleteUserSquad(squadId, userToRemove.id);
  }

  isUserFromOrganization(
    organizationId: number,
    userToAddOrganizationId: number,
  ) {
    return organizationId == userToAddOrganizationId;
  }
}
