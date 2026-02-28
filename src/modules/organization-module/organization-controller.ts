import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth-module/guards/jwt-guard';
import type { Request, Response } from 'express';
import { AdminGuard } from '../auth-module/guards/admin-guard';
import { UpdateOrganizationUseCase } from './use-cases/update-organization.use-case';
import { User } from '../auth-module/annotations/user-annotation';
import type { TSession } from '../user-module/interfaces';
import { OrganizationRepository } from './organization-repository';
import { UpdateOrganizationDto } from './dtos/update-organization-dto';

@Controller('organization')
export class OrganizationController {
  constructor(
    private updateOrganizationUseCase: UpdateOrganizationUseCase,
    private organizationRepository: OrganizationRepository,
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async organization(
    @Req() req: Request,
    @Res() res: Response,
    @User() reqUser: TSession,
  ) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const organization = await this.organizationRepository.findFirst({
      id: reqUser.organizationId,
    });
    res.status(200).send(organization);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
    @Body(ValidationPipe) dto: UpdateOrganizationDto,
  ) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await this.updateOrganizationUseCase.execute(dto, +id);
    return res.status(200).send();
  }
}
