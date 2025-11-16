import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { TSession } from '../../user-module/interfaces';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  generateAccessToken(user: TSession): string {
    const payload = {
      id: user.id,
      email: user.email,
      userName: user.userName,
      is_admin: user.isAdmin,
      organizationId: user.organizationId,
    };

    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  redirectWithAccessToken(res: Response, accessToken: string): void {
    console.log(accessToken);
    const uiUrl = this.configService.get<string>('UI_URL');
    const redirectUrl = `${uiUrl}://auth?access_token=${accessToken}`;
    res.redirect(redirectUrl);
  }

  static async generateEncryptedPassword(
    plainPassword = this.generatePassword(),
  ): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
  }

  static generatePassword(length: number = 8): string {
    const caracteres =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';

    for (let i = 0; i < length; i++) {
      const randomAux = Math.floor(Math.random() * caracteres.length);
      password += caracteres[randomAux];
    }

    return password;
  }

  async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
