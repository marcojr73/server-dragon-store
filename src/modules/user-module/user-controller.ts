import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user-service';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth-module/guards/jwt-guard';
import { User } from '../auth-module/annotations/user-annotation';
import type { TSession } from './interfaces';
import { UserRepository } from './user-repository';
import { AdminGuard } from '../auth-module/guards/admin-guard';
import { CreateOrUpdateUserDto } from './users-dto';
import { AuthService } from '../auth-module/services/auth-service';
import { CreateUserUseCase } from './use-cases/create-user-use-case';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Get(':id/balance')
  @UseGuards(JwtAuthGuard)
  async getBalance(@Param('id') id: string, @Res() res: Response) {
    const userId = Number(id);
    if (typeof userId !== 'number') {
      throw new BadRequestException();
    }
    const balance = await this.userRepository.getBalance({ id: userId });
    if (!balance) {
      throw new UnauthorizedException();
    }
    res.status(200).send(balance);
  }

  /**
   * Endpoint para listagem de usuários no aplicativo, não precisa de um token admin
   */
  @Get('searches')
  @UseGuards(JwtAuthGuard)
  async getEmployee(
    @Req() req: Request,
    @Res() res: Response,
    @User() reqUser: TSession,
  ) {
    const search = req.query.search as string;
    const employees = await this.userRepository.getEmployees(
      reqUser.id,
      reqUser.organizationId,
      search,
    );
    res.status(200).send(employees);
  }

  /**
   * Endpoint para listagem de usuários no backoffice, precisa de um token admin
   */
  @Get('/backoffice')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async list(
    @Req() req: Request,
    @Res() res: Response,
    @User() reqUser: TSession,
  ) {
    const search = req.query.search as string;
    const users = await this.userRepository.getUsersByOrganizationId(
      reqUser.organizationId,
      search,
    );
    res.status(200).send({ users });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUser(@Param('id') id: number, @Res() res: Response) {
    const user = await this.userRepository.getUser({ id: Number(id) });
    if (!user) {
      throw new UnauthorizedException();
    }

    return res.status(200).send(user);
  }

  /**
   * TODO: Deve validar se o usuário pertence a mesma organização do admin
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Param('id') userId: string,
    @Body(ValidationPipe) createOrUpdateUserDto: CreateOrUpdateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const data: Omit<CreateOrUpdateUserDto, 'password'> & {
      password?: string;
    } = {
      ...createOrUpdateUserDto,
    };
    if (data.password && data.password.length > 0) {
      data.password = await AuthService.generateEncryptedPassword(
        data.password,
      );
    } else {
      delete data.password;
    }
    await this.userRepository.update(data, +userId);
    res.status(200).send({ id: userId });
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(
    @Body(ValidationPipe) createOrUpdateUserDto: CreateOrUpdateUserDto,
    @Res() res: Response,
    @User() session: TSession,
  ) {
    const user = await this.createUserUseCase.execute(
      createOrUpdateUserDto,
      session,
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    res.status(201).send({ id: user.id });
  }

  /**
   * TODO: Deve validar se o usuário pertence a mesma organização do admin
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async delete(
    @Param('id') userId: string,
    @Req() req: Request,
    @Res() res: Response,
    @User() reqUser: TSession,
  ) {
    const user = await this.userRepository.delete(+userId);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    res.status(200).send({ id: user.id });
  }
}
