import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user-repository';
import { AuthService } from '../../auth-module/services/auth-service';
import { CreateOrUpdateUserDto } from '../users-dto';
import { TSession } from '../interfaces';
import { MailService } from '@core/mail-module/mail-service';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly repository: UserRepository,
    private readonly mailService: MailService,
  ) {}

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
    const user = await this.repository.create(data);
    await this.mailService.sendWelcomeEmail(payload.email, payload.userName);
    return user;
  }
}
