import { Module } from '@nestjs/common';
import { AuthController } from './auth-controller';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth-service';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './strategies/google-strategy';
import { UserModule } from '../user-module/user-module';
import { OrganizationModule } from '../organization-module/organization-module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MicrosoftStrategy } from './strategies/microsoft-strategy';
import { JwtStrategy } from './strategies/jwt-strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'google' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    OrganizationModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, MicrosoftStrategy, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
