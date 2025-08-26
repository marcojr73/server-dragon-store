import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../../user-module/user-repository';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userRepository: UserRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userToken = request.user;

    const user = await this.userRepository.getAuthUser({
      email: userToken.email,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.isAdmin) {
      throw new ForbiddenException();
    }

    return true;
  }
}
