import { Module } from '@nestjs/common';
import { ExchangeController } from './exchange-controller';
import { ExchangeRepository } from './exchange-repository';
import { UserModule } from '../user-module/user-module';
import { ExchangeUseCase } from './exchange-use-case';
import { HistoryModule } from '../history-module/history-module';
import { SquadModule } from '../squad-module/squad-module';
import { OrganizationModule } from '../organization-module/organization-module';
import { MailModule } from '@core/mail-module/mail-module';

@Module({
  imports: [
    UserModule,
    HistoryModule,
    SquadModule,
    OrganizationModule,
    MailModule,
  ],
  controllers: [ExchangeController],
  providers: [ExchangeRepository, ExchangeUseCase, ExchangeRepository],
  exports: [ExchangeRepository],
})
export class ExchangeModule {}
