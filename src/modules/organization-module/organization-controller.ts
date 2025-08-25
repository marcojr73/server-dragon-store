import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth-module/guards/jwt-guard';
import type { Request, Response } from 'express';

@Controller('organization')
export class OrganizationController {
  constructor() {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async history(@Req() req: Request, @Res() res: Response) {}
}
