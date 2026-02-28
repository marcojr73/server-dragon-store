import { Module } from '@nestjs/common';
import { ClaimRepository } from './claim-repository';
import { ClaimController } from './claim-controller';
import { ClaimUseCase } from './use-cases/claim-use-case';
import { UserModule } from '../user-module/user-module';
import { ProductsModule } from '../products-module/products-module';
import { NotifyExchangesUseCase } from './use-cases/notify-exchanges-use-case';
import { OrganizationModule } from '../organization-module/organization-module';
import { MailModule } from '@core/mail-module/mail-module';

@Module({
  imports: [UserModule, ProductsModule, OrganizationModule, MailModule],
  controllers: [ClaimController],
  providers: [ClaimRepository, ClaimUseCase, NotifyExchangesUseCase],
  exports: [ClaimRepository],
})
export class ClaimModule {}
