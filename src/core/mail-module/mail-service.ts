import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { subjects } from '@core/mail-module/subjects';

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

  async sendWelcomeEmail(email: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Bem-vindo!',
      html: `<h1>Olá ${name}</h1><p>Bem-vindo ao nosso sistema!</p>`,
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
    console.log(to);
    await this.mailerService.sendMail({
      to,
      subject: 'Notificação de resgate',
      template: 'user_claim',
      context: { userName, productName, productImage, date: Date.now() },
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
