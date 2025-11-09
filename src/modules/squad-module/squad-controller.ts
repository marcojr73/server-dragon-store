import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth-module/guards/jwt-guard';
import type { Response } from 'express';
import { User } from '../auth-module/annotations/user-annotation';
import type { TUser } from '../user-module/interfaces';
import { SquadUseCase } from './use-cases/squad-use-case';
import { AdminGuard } from '../auth-module/guards/admin-guard';
import { CreateOrUpdateSquadDto } from './dtos/squad-dto';
import { ListUsersSquad } from './use-cases/list-users-squad';
import { AddUserSquadDto } from './dtos/add-user-squad-dto';
import { AddUserSquadUseCase } from './use-cases/add-user-squad-use-case';
import { RemoveUserSquadUseCase } from './use-cases/remove-user-squad-use-case';

@Controller('squads')
export class SquadController {
  constructor(
    private readonly squadUseCase: SquadUseCase,
    private readonly listUsersSquad: ListUsersSquad,
    private readonly addUserSquadUseCase: AddUserSquadUseCase,
    private readonly removeUserSquadUseCase: RemoveUserSquadUseCase,
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async squad(@Res() res: Response) {
    const squads = await this.squadUseCase.getSquadsOrderedByScore();
    res.status(200).send(squads);
  }

  @Post('/')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(
    @Body(ValidationPipe) dto: CreateOrUpdateSquadDto,
    @Res() res: Response,
    @User() ReqUser: TUser,
  ) {
    const squad = await this.squadUseCase.create(dto, ReqUser);
    res.status(201).send(squad);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Param('id') id: number,
    @Body(ValidationPipe) dto: CreateOrUpdateSquadDto,
    @Res() res: Response,
  ) {
    const squad = await this.squadUseCase.update(dto, +id);
    res.status(201).send(squad);
  }

  @Get(':id/users')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getUsersSquad(@Param('id') id: number, @Res() res: Response) {
    const usersSquad = await this.listUsersSquad.execute(id);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    res.status(201).send(usersSquad);
  }

  @Put(':id/users')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createUsersSquad(
    @Param('id') id: number,
    @Body(ValidationPipe) payload: AddUserSquadDto,
    @Res() res: Response,
    @User() ReqUser: TUser,
  ) {
    const usersSquad = await this.addUserSquadUseCase.execute(
      ReqUser,
      payload,
      id,
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));

    res.status(200).send(usersSquad);
  }

  @Delete(':id/users/:userId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async removeUserSquad(
    @Param('id') squadId: number,
    @Param('userId') userId: number,
    @Res() res: Response,
    @User() ReqUser: TUser,
  ) {
    const usersSquad = await this.removeUserSquadUseCase.execute(
      squadId,
      userId,
      ReqUser,
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    res.status(200).send(usersSquad);
  }
}
