import { Module } from '@nestjs/common';
import { OrganizationRepository } from './organization-repository';
import { OrganizationController } from './organization-controller';

@Module({
  imports: [],
  controllers: [OrganizationController],
  providers: [OrganizationRepository],
  exports: [OrganizationRepository],
})
export class OrganizationModule {}
