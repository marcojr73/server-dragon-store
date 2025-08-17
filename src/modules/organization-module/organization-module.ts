import { Module } from '@nestjs/common';
import { OrganizationRepository } from './organization-repository';

@Module({
  imports: [],
  controllers: [],
  providers: [OrganizationRepository],
  exports: [OrganizationRepository],
})
export class OrganizationModule {}
