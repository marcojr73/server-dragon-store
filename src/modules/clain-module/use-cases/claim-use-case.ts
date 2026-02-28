import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClaimRepository } from '../claim-repository';
import { UserRepository } from '../../user-module/user-repository';
import { ProductsRepository } from '../../products-module/products-repository';
import { PrismaService } from '@core/prisma-module/prisma-service';
import { MailService } from '@core/mail-module/mail-service';

@Injectable()
export class ClaimUseCase {
  constructor(
    private readonly repository: ClaimRepository,
    private readonly userRepository: UserRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async execute(userId: number, productId: number) {
    const user = await this.userRepository.getUser({ id: +userId });
    if (!productId) {
      throw new NotFoundException();
    }
    if (!user) {
      throw new UnauthorizedException();
    }
    const product = await this.productsRepository.getProductById(productId);
    if (!product) {
      throw new NotFoundException();
    }
    if (product.store.id !== user.organizationId) {
      throw new ConflictException();
    }
    if (product.value > user.gas) {
      throw new ConflictException();
    }
    const response = this.prisma.$transaction(async () => {
      await this.userRepository.update(
        { gas: user.gas - product.value },
        userId,
      );
      await this.repository.create(productId, userId);
    });
    await this.mailService.sendClaimEmail(
      user.email,
      user.userName,
      product.name,
      product.picture,
    );
    return response;
  }
}
