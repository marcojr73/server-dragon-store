import { Module } from '@nestjs/common';
import { SquadController } from './squad-controller';
import { SquadRepository } from './repositories/squad-repository';
import { UserModule } from '../user-module/user-module';
import { SquadUseCase } from './use-cases/squad-use-case';
import { UsersSquadRepository } from './repositories/users-squad-repository';
import { ListUsersSquad } from './use-cases/list-users-squad';
import { AddUserSquadUseCase } from './use-cases/add-user-squad-use-case';
import { RemoveUserSquadUseCase } from './use-cases/remove-user-squad-use-case';
import { DeleteSquadUseCase } from './use-cases/delete-squad-use-case';
import { ListSquadUser } from './use-cases/list-squad-user';

@Module({
  imports: [UserModule],
  controllers: [SquadController],
  providers: [
    SquadRepository,
    SquadUseCase,
    AddUserSquadUseCase,
    RemoveUserSquadUseCase,
    DeleteSquadUseCase,
    ListSquadUser,
    ListUsersSquad,
    SquadRepository,
    UsersSquadRepository,
  ],
  exports: [SquadRepository],
})
export class SquadModule {}
