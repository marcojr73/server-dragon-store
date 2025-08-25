import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth-module/guards/jwt-guard';
import type { Request, Response } from 'express';
import { User } from '../auth-module/annotations/user-annotation';
import type { TUser } from '../user-module/interfaces';
import { UserRepository } from '../user-module/user-repository';
import { StoreRepository } from './store-repository';
import { StoreUseCase } from './store-use-case';

@Controller('store')
export class StoreController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly storeUseCase: StoreUseCase,
    private readonly storeRepository: StoreRepository,
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
    const store =
      await this.storeRepository.listProductsOfStoreByOrganizationId(
        +user.organization.id,
      );
    res.status(200).send({ store });
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async rescue(
    @Req() req: Request,
    @Res() res: Response,
    @User() ReqUser: TUser,
  ) {
    const { productId } = req.body;
    await this.storeUseCase.rescue(ReqUser.id, productId);
    res.status(204).send();
  }
}
