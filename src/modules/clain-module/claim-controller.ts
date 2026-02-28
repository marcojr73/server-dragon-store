import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { User } from '../auth-module/annotations/user-annotation';
import type { TSession } from '../user-module/interfaces';
import { ClaimUseCase } from './use-cases/claim-use-case';
import { ClaimDto } from './dtos/claim-dto';
import { JwtAuthGuard } from '../auth-module/guards/jwt-guard';
import { AdminGuard } from '../auth-module/guards/admin-guard';
import { NotifyExchangesUseCase } from './use-cases/notify-exchanges-use-case';

@Controller('claim')
export class ClaimController {
  constructor(
    private claimUseCase: ClaimUseCase,
    private notifyExchangesUseCase: NotifyExchangesUseCase,
  ) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async claim(
    @Req() req: Request,
    @Res() res: Response,
    @User() ReqUser: TSession,
    @Body(ValidationPipe) dto: ClaimDto,
  ) {
    const { productId } = req.body;
    await this.claimUseCase.execute(ReqUser.id, productId);
    res.status(204).send();
  }

  @Get('notify')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async notify(@Res() res: Response, @User() session: TSession) {
    await this.notifyExchangesUseCase.execute(session.organizationId);
    res.status(200).send();
  }
}
