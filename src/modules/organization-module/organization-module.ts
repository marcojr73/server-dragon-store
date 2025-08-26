import { Module } from '@nestjs/common';
import { OrganizationRepository } from './organization-repository';
import { OrganizationController } from './organization-controller';
import { UserModule } from '../user-module/user-module';
import { UpdateOrganizationUseCase } from './use-cases/update-organization.use-case';

@Module({
  imports: [UserModule],
  controllers: [OrganizationController],
  providers: [OrganizationRepository, UpdateOrganizationUseCase],
  exports: [OrganizationRepository],
})
export class OrganizationModule {}
