import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth-module/guards/jwt-guard';
import type { Request, Response } from 'express';
import { User } from '../auth-module/annotations/user-annotation';
import type { TSession } from '../user-module/interfaces';
import { UserRepository } from '../user-module/user-repository';
import { ProductsRepository } from './products-repository';
import { AdminGuard } from '../auth-module/guards/admin-guard';
import { CreateOrUpdateProductDto } from './products-dto';
import { StoreRepository } from '../store-module/store-repository';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly storeRepository: StoreRepository,
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async list(
    @Req() req: Request,
    @Res() res: Response,
    @User() ReqUser: TSession,
  ) {
    const user = await this.userRepository.getUser({ id: ReqUser.id });
    if (!user) {
      throw new UnauthorizedException();
    }

    const products = await this.productsRepository.listProductsByOrganizationId(
      user.organization.id,
    );

    res.status(200).send({ products });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Param('id') productId: string,
    @Body(ValidationPipe) updateProductDto: CreateOrUpdateProductDto,
    @Req() req: Request,
    @Res() res: Response,
    @User() reqUser: TSession,
  ) {
    await this.productsRepository.update(+productId, updateProductDto);
    res.status(200).send({ id: productId });
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(
    @Body(ValidationPipe) dto: CreateOrUpdateProductDto,
    @Req() req: Request,
    @Res() res: Response,
    @User() reqUser: TSession,
  ) {
    const store = await this.storeRepository.findByOrganizationIdOrFail(
      reqUser.organizationId,
    );
    const product = await this.productsRepository.create({
      ...dto,
      storeId: store.id,
    });
    res.status(200).send({ id: product.id });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async delete(
    @Param('id') productId: string,
    @Req() req: Request,
    @Res() res: Response,
    @User() reqUser: TSession,
  ) {
    await this.productsRepository.deleteProduct(+productId);
    res.status(200).send({ id: productId });
  }
}
