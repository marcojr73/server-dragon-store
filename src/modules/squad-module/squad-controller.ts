import {
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth-module/jwt-guard';
import type { Request, Response } from 'express';
import { User } from '../auth-module/annotations/user-annotation';
import type { TUser } from '../user-module/interfaces';
import { UserRepository } from '../user-module/user-repository';
import { SquadRepository } from './squad-repository';
import { SquadUseCase } from './squad-use-case';

@Controller('squad')
export class SquadController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly historyRepository: SquadRepository,
    private readonly squadUseCase: SquadUseCase,
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async squad(
    @Req() req: Request,
    @Res() res: Response,
    @User() ReqUser: TUser,
  ) {
    const user = await this.userRepository.getUser({ id: ReqUser.id });
    if (!user) {
      throw new UnauthorizedException();
    }
    const squads = await this.squadUseCase.getSquadsOrderedByScore();
    res.status(200).send(squads);
  }
}
