import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth-module/guards/jwt-guard';
import type { Response } from 'express';
import { User } from '../auth-module/annotations/user-annotation';
import type { TSession } from '../user-module/interfaces';
import { SquadUseCase } from './use-cases/squad-use-case';
import { AdminGuard } from '../auth-module/guards/admin-guard';
import { ListUsersSquad } from './use-cases/list-users-squad';
import { AddUserSquadDto } from './dtos/add-user-squad-dto';
import { AddUserSquadUseCase } from './use-cases/add-user-squad-use-case';
import { RemoveUserSquadUseCase } from './use-cases/remove-user-squad-use-case';
import { CreateSquadDto } from './dtos/create-squad-dto';
import { PatchSquadDto } from './dtos/patch-squad-dto';
import { DeleteSquadUseCase } from './use-cases/delete-squad-use-case';
import { ListSquadUser } from './use-cases/list-squad-user';

@Controller('squads')
export class SquadController {
  constructor(
    private readonly squadUseCase: SquadUseCase,
    private readonly listUsersSquad: ListUsersSquad,
    private readonly addUserSquadUseCase: AddUserSquadUseCase,
    private readonly removeUserSquadUseCase: RemoveUserSquadUseCase,
    private readonly listSquadUser: ListSquadUser,
    private readonly deleteSquadUseCase: DeleteSquadUseCase,
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
    @Body(ValidationPipe) dto: CreateSquadDto,
    @Res() res: Response,
    @User() ReqUser: TSession,
  ) {
    const squad = await this.squadUseCase.create(dto, ReqUser);
    res.status(201).send(squad);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Param('id') id: number,
    @Body(ValidationPipe) dto: PatchSquadDto,
    @Res() res: Response,
  ) {
    const squad = await this.squadUseCase.update(dto, +id);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    res.status(201).send(squad);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async delete(
    @Param('id') id: number,
    @User() ReqUser: TSession,
    @Res() res: Response,
  ) {
    const squad = await this.deleteSquadUseCase.execute(+id, ReqUser);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    res.status(200).send(squad);
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
    @User() ReqUser: TSession,
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
    @User() ReqUser: TSession,
  ) {
    const usersSquad = await this.removeUserSquadUseCase.execute(
      squadId,
      userId,
      ReqUser,
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    res.status(200).send(usersSquad);
  }

  @Get('/users/:userId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async ListSquadUser(
    @Param('userId') userId: number,
    @Res() res: Response,
    @User() session: TSession,
  ) {
    const usersSquad = await this.listSquadUser.execute(userId, session);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    res.status(200).send(usersSquad);
  }
}
