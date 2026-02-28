import { IsInt } from 'class-validator';

export class ClaimDto {
  @IsInt()
  productId: number;
}
