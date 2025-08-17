import { Module } from '@nestjs/common';
import { HistoryController } from './history-controller';
import { HistoryRepository } from './history-repository';
import { UserModule } from '../user-module/user-module';

@Module({
  imports: [UserModule],
  controllers: [HistoryController],
  providers: [HistoryRepository],
  exports: [HistoryRepository],
})
export class HistoryModule {}
