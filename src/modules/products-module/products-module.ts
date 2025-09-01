import { forwardRef, Module } from '@nestjs/common';
import { ProductsController } from './products-controller';
import { ProductsRepository } from './products-repository';
import { UserModule } from '../user-module/user-module';
import { StoreModule } from '../store-module/store-module';

@Module({
  imports: [UserModule, forwardRef(() => StoreModule)],
  controllers: [ProductsController],
  providers: [ProductsRepository],
  exports: [ProductsRepository],
})
export class ProductsModule {}
