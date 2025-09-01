import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-microsoft';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../user-module/user-repository';
import { OrganizationRepository } from '../../organization-module/organization-repository';
import { AuthService } from '../services/auth-service';

interface MicrosoftEmail {
  value: string;
  type?: string;
}

interface MicrosoftProfile {
  id: string;
  displayName: string;
  emails: MicrosoftEmail[];
  picture?: string;
  name?: {
    familyName?: string;
    givenName?: string;
    middleName?: string;
  };
  _raw?: string;
  _json?: any;
}

function isMicrosoftProfile(profile: unknown): profile is MicrosoftProfile {
  return (
    typeof profile === 'object' &&
    profile !== null &&
    typeof (profile as any).id === 'string' &&
    typeof (profile as any).displayName === 'string' &&
    Array.isArray((profile as any).emails) &&
    (profile as any).emails.length > 0 &&
    typeof (profile as any).emails[0].value === 'string'
  );
}

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
    private organizationRepository: OrganizationRepository,
    private authService: AuthService,
  ) {
    const clientID = configService.get<string>('MICROSOFT_CLIENT_ID');
    const clientSecret = configService.get<string>('MICROSOFT_CLIENT_SECRET');
    const host = configService.get<string>('HOST');

    if (!clientID || clientID === 'clientid') {
      throw new Error(
        'MICROSOFT_CLIENT_ID não configurado ou usando valor de exemplo',
      );
    }

    if (!clientSecret || clientSecret === 'secret') {
      throw new Error(
        'MICROSOFT_CLIENT_SECRET não configurado ou usando valor de exemplo',
      );
    }

    if (!host) {
      throw new Error('HOST não configurado');
    }

    super({
      clientID,
      clientSecret,
      callbackURL: `${host}/auth/microsoft/callback`,
      scope: ['user.read', 'mail.read'],
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    accessToken: string,
    refreshToken: string,
    profile: unknown,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      console.log(
        '🔍 Validando perfil do Microsoft:',
        JSON.stringify(profile, null, 2),
      );

      if (!isMicrosoftProfile(profile)) {
        console.error('❌ Profile não passou no type guard');
        return done(new Error('Estrutura do perfil Microsoft inválida'), null);
      }

      const typedProfile: MicrosoftProfile = profile;

      console.log('✅ Profile validado:', {
        id: typedProfile.id,
        displayName: typedProfile.displayName,
        email: typedProfile.emails[0].value,
        hasPicture: !!typedProfile.picture,
      });

      const existingUser = await this.userRepository.findByMicrosoftId(
        typedProfile.id,
      );

      if (existingUser) {
        console.log('👤 Usuário existente encontrado:', existingUser.id);
        return done(null, existingUser);
      } else {
        console.log('🆕 Criando novo usuário');

        const organization = await this.organizationRepository.findFirst({
          id: 1,
        });

        if (!organization) {
          console.error('❌ Organização não encontrada');
          return done(new Error('Organization not found'), null);
        }

        const newUser = await this.userRepository.create({
          userName: typedProfile.displayName,
          email: typedProfile.emails[0].value,
          picture: typedProfile.picture || null,
          password: await AuthService.generateEncryptedPassword(),
          organizationId: organization.id,
          googleId: null,
          microsoftId: typedProfile.id,
          isAdmin: false,
          coins: 0,
          gas: 0,
        });

        console.log('✅ Novo usuário criado:', newUser.id);
        return done(null, newUser);
      }
    } catch (error) {
      console.error('❌ Erro na validação Microsoft:', error);
      return done(error, null);
    }
  }
}
