import { forwardRef, Module } from '@nestjs/common';
import { UserRepository } from './user-repository';
import { UserController } from './user-controller';
import { UserService } from './user-service';
import { AuthModule } from '../auth-module/auth-module';
import { CreateUserUseCase } from './use-cases/create-user-use-case';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserRepository, UserService, CreateUserUseCase],
  exports: [UserRepository],
})
export class UserModule {}
