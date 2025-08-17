import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { User } from '../auth-module/annotations/user-annotation';
import type { TUser } from '../user-module/interfaces';
import { UserRepository } from '../user-module/user-repository';
import { ExchangeUseCase } from './exchange-use-case';
import { JwtAuthGuard } from '../auth-module/jwt-guard';

@Controller('exchange')
export class ExchangeController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly exchangeUseCase: ExchangeUseCase,
  ) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  async exchange(
    @Req() req: Request,
    @Res() res: Response,
    @User() ReqUser: TUser,
  ) {
    const { employeeId, coins, message, onHistory } = req.body;
    const exchangeId = await this.exchangeUseCase.exchange(
      ReqUser.id,
      +coins,
      +employeeId,
      message,
      onHistory,
    );
    res.status(201).send({ id: exchangeId });
  }
}
