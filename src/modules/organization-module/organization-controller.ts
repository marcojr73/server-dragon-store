import { Controller, Get, Put, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth-module/guards/jwt-guard';
import type { Request, Response } from 'express';
import { AdminGuard } from '../auth-module/guards/admin-guard';
import { UpdateOrganizationUseCase } from './use-cases/update-organization.use-case';
import { User } from '../auth-module/annotations/user-annotation';
import type { TUser } from '../user-module/interfaces';
import { OrganizationRepository } from './organization-repository';

@Controller('organization')
export class OrganizationController {
  constructor(
    private updateOrganizationUseCase: UpdateOrganizationUseCase,
    private organizationRepository: OrganizationRepository,
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async organization(
    @Req() req: Request,
    @Res() res: Response,
    @User() reqUser: TUser,
  ) {
    const organization = await this.organizationRepository.findFirst({
      id: reqUser.organizationId,
    });
    res.status(200).send(organization);
  }

  @Put('/')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(@Req() req: Request, @Res() res: Response) {
    await this.updateOrganizationUseCase.execute(req.body);
    return res.status(200).send();
  }
}
