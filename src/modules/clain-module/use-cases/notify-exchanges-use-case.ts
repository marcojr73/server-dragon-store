import { OrganizationRepository } from '../../organization-module/organization-repository';
import { MailService } from '@core/mail-module/mail-service';
import { ClaimRepository } from '../claim-repository';
import { formatters } from '@core/formatters/format-date';
import { ReportInterval } from '@core/enums/resport-interval';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class NotifyExchangesUseCase {
  constructor(
    private readonly claimRepository: ClaimRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly mailService: MailService,
  ) {}

  async execute(organizationId: number) {
    const organization = await this.organizationRepository.findFirst({
      id: organizationId,
    });

    if (!organization) {
      throw new NotFoundException();
    }

    if (!organization.responsibleEmail) {
      throw new BadRequestException('Organization has no responsible email');
    }

    const reportSendInterval: ReportInterval = organization.reportSendInterval;

    const { startAt, endAt } = this.getInterval(reportSendInterval);

    const claims = await this.claimRepository.listByOrganization(
      organizationId,
      startAt,
      endAt,
    );

    await this.mailService.sendExchangeOrdersToAdmin(
      organization.responsibleEmail,
      organization.responsibleName ?? organization.name,
      formatters.formatDateTime(startAt),
      formatters.formatDateTime(endAt),
      claims.map((claim) => {
        return {
          userName: claim.user.userName,
          productName: claim.product.name,
          date: formatters.formatDateTime(claim.createdAt),
        };
      }),
    );
  }

  private getInterval(reportSendInterval: ReportInterval) {
    const today = new Date();

    let startAt: Date;
    let endAt: Date;

    switch (reportSendInterval) {
      case ReportInterval.DAILY: {
        startAt = this.getStartOfDay(today);
        endAt = this.getEndOfDay(today);
        break;
      }

      case ReportInterval.WEEKLY: {
        const startOfWeek = this.getStartOfWeek(today);
        startAt = startOfWeek;
        endAt = this.getEndOfWeek(startOfWeek);
        break;
      }

      case ReportInterval.MONTHLY: {
        startAt = this.getStartOfMonth(today);
        endAt = this.getEndOfMonth(today);
        break;
      }

      default: {
        startAt = this.getStartOfDay(today);
        endAt = this.getEndOfDay(today);
      }
    }

    return { startAt, endAt };
  }

  private getStartOfDay(date: Date): Date {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  private getEndOfDay(date: Date): Date {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end;
  }

  private getStartOfWeek(date: Date): Date {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    start.setHours(0, 0, 0, 0);
    return start;
  }

  private getEndOfWeek(startOfWeek: Date): Date {
    const end = new Date(startOfWeek);
    end.setDate(startOfWeek.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  }

  private getStartOfMonth(date: Date): Date {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  private getEndOfMonth(date: Date): Date {
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
    return end;
  }
}
