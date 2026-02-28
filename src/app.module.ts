import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth-module/auth-module';
import { PrismaModule } from './core/prisma-module/prisma-module';
import { UserModule } from './modules/user-module/user-module';
import { OrganizationModule } from './modules/organization-module/organization-module';
import { HistoryModule } from './modules/history-module/history-module';
import { SquadModule } from './modules/squad-module/squad-module';
import { ExchangeModule } from './modules/exchange-module/exchange-module';
import { StoreModule } from './modules/store-module/store-module';
import { ProductsModule } from './modules/products-module/products-module';
import { MailModule } from '@core/mail-module/mail-module';
import { ClaimModule } from './modules/clain-module/claim-module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    ClaimModule,
    UserModule,
    OrganizationModule,
    HistoryModule,
    StoreModule,
    ProductsModule,
    SquadModule,
    ExchangeModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
