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

    const startAt = new Date();
    const endAt = new Date();

    const reportSendInterval: ReportInterval = organization.reportSendInterval;

    switch (reportSendInterval) {
      case ReportInterval.WEEKLY: {
        const today = new Date();

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        startAt.setTime(startOfWeek.getTime());
        endAt.setTime(endOfWeek.getTime());
        break;
      }

      case ReportInterval.MONTHLY: {
        const today = new Date();

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0,
        );
        endOfMonth.setHours(23, 59, 59, 999);

        startAt.setTime(startOfMonth.getTime());
        endAt.setTime(endOfMonth.getTime());
        break;
      }
    }

    startAt.setHours(0, 0, 0, 0);

    const claims = await this.claimRepository.listByOrganization(
      organizationId,
      startAt,
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
}
