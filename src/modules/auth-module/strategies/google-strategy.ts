import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../user-module/user-repository';
import { OrganizationRepository } from '../../organization-module/organization-repository';
import { AuthService } from '../services/auth-service';

interface GoogleProfile {
  id: string;
  displayName: string;
  emails: Array<{ value: string; verified: boolean }>;
  photos: Array<{ value: string }>;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
    private organizationRepository: OrganizationRepository,
    private authService: AuthService,
  ) {
    console.log('🔧 Configurando Google Strategy...');

    const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    const host = configService.get<string>('HOST');

    if (!clientID || clientID === 'clientid') {
      throw new Error(
        'GOOGLE_CLIENT_ID não configurado ou usando valor de exemplo',
      );
    }

    if (!clientSecret || clientSecret === 'secret') {
      throw new Error(
        'GOOGLE_CLIENT_SECRET não configurado ou usando valor de exemplo',
      );
    }

    if (!host) {
      throw new Error('HOST não configurado');
    }

    super({
      clientID,
      clientSecret,
      callbackURL: `${host}/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      console.log('🔍 Validando perfil do Google:', profile.id);

      const existingUser = await this.userRepository.findByGoogleId(profile.id);

      if (existingUser) {
        console.log('👤 Usuário existente encontrado');
        return done(null, existingUser);
      } else {
        console.log('🆕 Criando novo usuário');

        const organization = await this.organizationRepository.findFirst({
          id: 1,
        });

        if (!organization) {
          throw new Error('Organization not found');
        }

        const newUser = await this.userRepository.create({
          userName: profile.displayName,
          email: profile.emails[0].value,
          picture: profile.photos[0].value,
          password: await AuthService.generateEncryptedPassword(),
          organizationId: organization.id,
          googleId: profile.id,
          microsoftId: null,
          isAdmin: false,
          coins: 0,
          gas: 0,
        });

        console.log('✅ Novo usuário criado:', newUser.id);
        return done(null, newUser);
      }
    } catch (error) {
      console.error('❌ Erro na validação Google:', error);
      return done(error, null);
    }
  }
}
