import { forwardRef, Module } from '@nestjs/common';
import { UserRepository } from './user-repository';
import { UserController } from './user-controller';
import { UserService } from './user-service';
import { AuthModule } from '../auth-module/auth-module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserRepository],
})
export class UserModule {}
