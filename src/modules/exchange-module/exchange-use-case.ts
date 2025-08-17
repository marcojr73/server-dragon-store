import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ExchangeRepository } from './exchange-repository';
import { UserRepository } from '../user-module/user-repository';
import { SquadRepository } from '../squad-module/squad-repository';
import { PrismaService } from '../prisma-module/prisma-service';
import { HistoryRepository } from '../history-module/history-repository';

@Injectable()
export class ExchangeUseCase {
  constructor(
    private readonly squadRepository: SquadRepository,
    private readonly userRepository: UserRepository,
    private readonly historyRepository: HistoryRepository,
    private prisma: PrismaService,
    private readonly exchangeRepository: ExchangeRepository,
  ) {}

  validateBalance(userCoins: number, coins: number) {
    if (userCoins < coins) {
      throw new UnprocessableEntityException('Insufficient balance');
    }
  }

  validateIsSameUser(userId: number, employeeId: number) {
    if (userId === employeeId) {
      throw new ConflictException("You can't send coins for yourself");
    }
  }

  async validateUser(userId: number, employeeId: number, coins: number) {
    const user = await this.userRepository.getUser({ id: userId });
    const employee = await this.userRepository.getUser({ id: employeeId });
    if (!user || !employee) {
      throw new NotFoundException();
    }
    this.validateBalance(user.coins, coins);
    return { user, employee };
  }

  async exchange(
    userId: number,
    coins: number,
    employeeId: number,
    message: string | null = null,
    onHistory = true,
  ) {
    this.validateIsSameUser(userId, employeeId);
    const people = await this.validateUser(userId, employeeId, coins);

    return this.prisma.$transaction(async () => {
      const exchange = await this.exchangeRepository.create({
        userId,
        employeeId,
        value: coins,
        message,
      });
      await this.userRepository.update(
        { coins: people.user.coins - coins },
        people.user.id,
      );
      people.employee.userSquads.forEach((userSquad) => {
        (async () => {
          await this.squadRepository.createSquadScore({
            score: coins,
            squadId: userSquad.squad.id,
            organizationId: people.employee.organization.id,
          });
        })();
      });
      if (onHistory) {
        await this.historyRepository.create({
          exchangeId: exchange.id,
          organizationId: people.user.organization.id,
        });
      }
      return exchange.id;
    });
  }
}
