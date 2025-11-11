import { BadRequestException, Injectable } from '@nestjs/common';
import { SquadRepository } from '../repositories/squad-repository';
import { TSession } from '../../user-module/interfaces';
import { AddUserSquadDto } from '../dtos/add-user-squad-dto';
import { UserRepository } from '../../user-module/user-repository';

@Injectable()
export class AddUserSquadUseCase {
  constructor(
    private readonly squadRepository: SquadRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(user: TSession, payload: AddUserSquadDto, squadId: number) {
    const userToAdd = await this.userRepository.getUser({ id: payload.id });

    if (!userToAdd) {
      throw new BadRequestException('User does not exist');
    }

    if (
      !this.isUserFromOrganization(
        user.organizationId,
        userToAdd.organization.id,
      )
    ) {
      throw new BadRequestException('User does not belong to organization');
    }

    return this.squadRepository.createUserSquad(squadId, userToAdd.id);
  }

  isUserFromOrganization(
    organizationId: number,
    userToAddOrganizationId: number,
  ) {
    return organizationId == userToAddOrganizationId;
  }
}
