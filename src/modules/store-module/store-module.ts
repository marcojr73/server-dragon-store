import { forwardRef, Module } from '@nestjs/common';
import { StoreController } from './store-controller';
import { StoreRepository } from './store-repository';
import { UserModule } from '../user-module/user-module';
import { ProductsModule } from '../products-module/products-module';

@Module({
  imports: [UserModule, forwardRef(() => ProductsModule)],
  controllers: [StoreController],
  providers: [StoreRepository],
  exports: [StoreRepository],
})
export class StoreModule {}
