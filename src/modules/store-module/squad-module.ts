import { Module } from '@nestjs/common';
import { StoreController } from './store-controller';
import { StoreRepository } from './store-repository';
import { UserModule } from '../user-module/user-module';
import { StoreUseCase } from './store-use-case';

@Module({
  imports: [UserModule],
  controllers: [StoreController],
  providers: [StoreRepository, StoreUseCase, StoreRepository],
  exports: [],
})
export class StoreModule {}
