import { Injectable } from '@nestjs/common';
import { OrganizationRepository } from '../organization-repository';
import { UpdateOrganizationDto } from '../dtos/update-organization-dto';

@Injectable()
export class UpdateOrganizationUseCase {
  constructor(private organizationRepository: OrganizationRepository) {}

  async execute(data: UpdateOrganizationDto, id: number) {
    await this.organizationRepository.update(data, id);
  }
}
