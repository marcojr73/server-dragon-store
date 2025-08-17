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
import { HistoryRepository } from './history-repository';

@Controller('history')
export class HistoryController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly historyRepository: HistoryRepository,
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async history(
    @Req() req: Request,
    @Res() res: Response,
    @User() ReqUser: TUser,
  ) {
    let filterUserId: string | number = req.query.userId as string;
    if (filterUserId && typeof filterUserId === 'string') {
      filterUserId = parseInt(filterUserId);
    }
    const user = await this.userRepository.getUser({ id: ReqUser.id });
    if (!user) {
      throw new UnauthorizedException();
    }
    const history = await this.historyRepository.findMany(
      {
        organizationId: user.organization.id,
      },
      filterUserId as number,
    );
    res.status(200).send(history);
  }
}
