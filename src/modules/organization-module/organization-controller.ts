import { Controller, Get, Put, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth-module/guards/jwt-guard';
import type { Request, Response } from 'express';
import { AdminGuard } from '../auth-module/guards/admin-guard';
import { UpdateOrganizationUseCase } from './use-cases/update-organization.use-case';

@Controller('organization')
export class OrganizationController {
  constructor(private updateOrganizationUseCase: UpdateOrganizationUseCase) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async(@Req() req: Request, @Res() res: Response) {}

  @Put('/')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(@Req() req: Request, @Res() res: Response) {
    await this.updateOrganizationUseCase.execute(req.body);
    return res.status(200).send();
  }
}
