import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserRepository } from '../../user-module/user-repository';
import { AuthService } from '../services/auth-service';

@Injectable()
export class AuthBackofficeUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
  ) {}

  async execute(data: { email: string; password: string }) {
    const user = await this.userRepository.getAuthUser({
      email: data.email,
    });

    if (!user || !user.isAdmin) {
      throw new NotFoundException();
    }

    const isValidPassword = await this.authService.verifyPassword(
      data.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnprocessableEntityException();
    }

    return this.authService.generateAccessToken({
      id: user.id,
      isAdmin: user.isAdmin,
      organizationId: user.organization.id,
      email: user.email,
      userName: user.userName,
    });
  }
}
