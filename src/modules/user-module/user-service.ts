import { Controller } from '@nestjs/common';
import { UserRepository } from './user-repository';

@Controller('user')
export class UserService {
  constructor(private readonly userService: UserRepository) {}
}
