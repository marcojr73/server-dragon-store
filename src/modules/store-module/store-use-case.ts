import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../user-module/user-repository';
import { StoreRepository } from './store-repository';

@Injectable()
export class StoreUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly storeRepository: StoreRepository,
  ) {}

  async rescue(userId: number, productId: number) {
    const user = await this.userRepository.getUser({ id: +userId });
    if (!productId) {
      throw new NotFoundException();
    }
    if (!user) {
      throw new UnauthorizedException();
    }
    const product = await this.storeRepository.getProductById(productId);
    if (!product) {
      throw new NotFoundException();
    }
    if (product.store.id !== user.organization.id) {
      throw new ConflictException();
    }
    await this.userRepository.update({ gas: user.gas - product.value }, userId);
  }
}
