import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService } from './services/auth-service';
import { AuthBackofficeUserUseCase } from './use-cases/auth-backoffice-user-use-case';

interface AuthenticatedRequest extends Request {
  user: any;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private authBackofficeUserUseCase: AuthBackofficeUserUseCase,
  ) {}

  @Get('/')
  helloAuth(@Req() request: Request, @Res() response: Response) {
    response.send(
      '<div style="width: 100dvw; height: 100dvh; display: flex; justify-content: center; align-items: center; flex-direction: column; gap: 2rem">' +
        '<a href="/auth/google">' +
        '<button style="background: orange; padding: 2rem">Authenticate with Google</button></a>' +
        '<a href="/auth/microsoft">' +
        '<button style="background: midnightblue; color: #FFF; padding: 2rem">Authenticate with Microsoft</button></a>' +
        '</div>',
    );
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('microsoft')
  @UseGuards(AuthGuard('microsoft'))
  microsoftAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallback(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const accessToken = this.authService.generateAccessToken(req.user);
    return this.authService.redirectWithAccessToken(res, accessToken);
  }

  @Get('microsoft/callback')
  @UseGuards(AuthGuard('microsoft'))
  microsoftCallback(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const accessToken = this.authService.generateAccessToken(req.user);
    return this.authService.redirectWithAccessToken(res, accessToken);
  }

  @Post('/sign-in/organization')
  async organization(@Req() req: Request, @Res() res: Response) {
    const body = req.body;

    const accessToken = await this.authBackofficeUserUseCase.execute(body);

    return res.status(200).send({
      accessToken,
    });
  }
}
