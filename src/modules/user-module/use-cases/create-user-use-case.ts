import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user-repository';
import { AuthService } from '../../auth-module/services/auth-service';
import { CreateOrUpdateUserDto } from '../users-dto';
import { TSession } from '../interfaces';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(payload: CreateOrUpdateUserDto, session: TSession) {
    const data = {
      ...payload,
      password: payload.password ?? AuthService.generatePassword(),
      organizationId: session.organizationId,
      coins: 0,
      gas: 0,
      googleId: null,
      microsoftId: null,
    };
    return this.repository.create(data);
  }
}
