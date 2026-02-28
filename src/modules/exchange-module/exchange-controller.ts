import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { User } from '../auth-module/annotations/user-annotation';
import type { TSession } from '../user-module/interfaces';
import { UserRepository } from '../user-module/user-repository';
import { ExchangeUseCase } from './exchange-use-case';
import { JwtAuthGuard } from '../auth-module/guards/jwt-guard';
import { NotifyExchangesUseCase } from '../clain-module/use-cases/notify-exchanges-use-case';
import { AdminGuard } from '../auth-module/guards/admin-guard';

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeUseCase: ExchangeUseCase) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  async exchange(
    @Req() req: Request,
    @Res() res: Response,
    @User() ReqUser: TSession,
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
