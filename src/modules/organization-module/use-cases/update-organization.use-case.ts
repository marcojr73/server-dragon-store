import { Injectable } from '@nestjs/common';
import { OrganizationRepository } from '../organization-repository';
import { organizations } from '@prisma/client';

@Injectable()
export class UpdateOrganizationUseCase {
  constructor(private organizationRepository: OrganizationRepository) {}

  async execute(data: Partial<organizations> & { id: organizations['id'] }) {
    await this.organizationRepository.update(data);
  }
}
