import {
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user-service';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth-module/guards/jwt-guard';
import { User } from '../auth-module/annotations/user-annotation';
import type { TUser } from './interfaces';
import { UserRepository } from './user-repository';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getUser(
    @Req() req: Request,
    @Res() res: Response,
    @User() ReqUser: TUser,
  ) {
    const user = await this.userRepository.getUser({ id: ReqUser.id });
    if (!user) {
      throw new UnauthorizedException();
    }
    res.status(200).send(user);
  }

  @Get('balance')
  @UseGuards(JwtAuthGuard)
  async getBalance(@Res() res: Response, @User() ReqUser: TUser) {
    const balance = await this.userRepository.getBalance({ id: ReqUser.id });
    if (!balance) {
      throw new UnauthorizedException();
    }
    res.status(200).send(balance);
  }

  @Get('employee')
  @UseGuards(JwtAuthGuard)
  async getEmployee(
    @Req() req: Request,
    @Res() res: Response,
    @User() ReqUser: TUser,
  ) {
    const search = req.query.search as string;
    console.log(ReqUser);
    const user = await this.userRepository.getUser({ id: ReqUser.id });
    if (!user) {
      throw new UnauthorizedException();
    }
    const employees = await this.userRepository.getEmployees(
      user.id,
      user.organization.id,
      search,
    );
    res.status(200).send(employees);
  }
}
