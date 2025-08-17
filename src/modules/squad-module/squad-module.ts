import { Module } from '@nestjs/common';
import { SquadController } from './squad-controller';
import { SquadRepository } from './squad-repository';
import { UserModule } from '../user-module/user-module';
import { SquadUseCase } from './squad-use-case';

@Module({
  imports: [UserModule],
  controllers: [SquadController],
  providers: [SquadRepository, SquadUseCase, SquadRepository],
  exports: [SquadRepository],
})
export class SquadModule {}
