import { Module } from '@nestjs/common';
import { ExchangeController } from './exchange-controller';
import { ExchangeRepository } from './exchange-repository';
import { UserModule } from '../user-module/user-module';
import { ExchangeUseCase } from './exchange-use-case';
import { HistoryModule } from '../history-module/history-module';
import { SquadModule } from '../squad-module/squad-module';

@Module({
  imports: [UserModule, HistoryModule, SquadModule],
  controllers: [ExchangeController],
  providers: [ExchangeRepository, ExchangeUseCase, ExchangeRepository],
  exports: [],
})
export class ExchangeModule {}
