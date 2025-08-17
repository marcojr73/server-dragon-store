import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth-module/auth-module';
import { PrismaModule } from './modules/prisma-module/prisma-module';
import { UserModule } from './modules/user-module/user-module';
import { OrganizationModule } from './modules/organization-module/organization-module';
import { HistoryModule } from './modules/history-module/history-module';
import { StoreModule } from './modules/store-module/squad-module';
import { SquadModule } from './modules/squad-module/squad-module';
import { ExchangeModule } from './modules/exchange-module/exchange-module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    OrganizationModule,
    HistoryModule,
    StoreModule,
    SquadModule,
    ExchangeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
