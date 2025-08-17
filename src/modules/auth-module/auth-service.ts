import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { TUser } from '../user-module/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  generateAccessToken(user: TUser): string {
    const payload = {
      id: user.id,
      email: user.email,
      userName: user.userName,
      organizationId: user.organizationId,
    };

    return this.jwtService.sign(payload);
  }

  redirectWithAccessToken(res: Response, accessToken: string): void {
    console.log(accessToken);
    const uiUrl = this.configService.get<string>('UI_URL');
    const redirectUrl = `${uiUrl}://auth?access_token=${accessToken}`;
    res.redirect(redirectUrl);
  }
}
