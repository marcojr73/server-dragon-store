import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { subjects } from '@core/mail-module/subjects';
import { formatters } from '@core/formatters/format-date';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, text: string) {
    await this.mailerService.sendMail({
      to,
      subject,
      text,
    });
  }

  async sendWelcomeEmail(to: string, userName: string) {
    const playStoreLink = process.env.PLAY_STORE_LINK;
    const appStoreLink = process.env.APP_STORE_LINK;

    await this.mailerService.sendMail({
      to,
      subject: 'Bem-vindo a Dragon store',
      template: 'welcome',
      context: {
        userName,
        playStoreLink,
        appStoreLink,
      },
      attachments: [
        {
          filename: 'logo.png',
          path: 'assets/dragon.png',
          cid: 'logo',
        },
      ],
    });
  }

  async sendExchangeOrdersToAdmin(
    to: string,
    adminName: string,
    startAt: string,
    endAt: string,
    claims: {
      userName: string;
      productName: string;
      date: string;
    }[],
  ) {
    await this.mailerService.sendMail({
      to,
      subject: subjects.exchangeOrders,
      template: 'claims_history',
      context: {
        adminName,
        startAt,
        endAt,
        claimsLength: claims.length,
        claims,
      },
      attachments: [
        {
          filename: 'logo.png',
          path: 'assets/dragon.png',
          cid: 'logo',
        },
      ],
    });
  }

  async sendClaimEmail(
    to: string,
    userName: string,
    productName: string,
    productImage: string | null,
  ) {
    await this.mailerService.sendMail({
      to,
      subject: 'Notificação de resgate',
      template: 'user_claim',
      context: {
        userName,
        productName,
        productImage,
        date: formatters.formatDateTime(new Date()),
      },
      attachments: [
        {
          filename: 'logo.png',
          path: 'assets/dragon.png',
          cid: 'logo',
        },
      ],
    });
  }
}
