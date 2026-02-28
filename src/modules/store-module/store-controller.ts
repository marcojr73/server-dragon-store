import {
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth-module/guards/jwt-guard';
import type { Request, Response } from 'express';
import { User } from '../auth-module/annotations/user-annotation';
import type { TSession } from '../user-module/interfaces';
import { UserRepository } from '../user-module/user-repository';
import { StoreRepository } from './store-repository';

@Controller('store')
export class StoreController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly storeRepository: StoreRepository,
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async list(
    @Req() req: Request,
    @Res() res: Response,
    @User() ReqUser: TSession,
  ) {
    const user = await this.userRepository.getUser({ id: ReqUser.id });
    if (!user) {
      throw new UnauthorizedException();
    }
    const store =
      await this.storeRepository.listProductsOfStoreByOrganizationId(
        +user.organizationId,
      );
    res.status(200).send({ store });
  }
}
