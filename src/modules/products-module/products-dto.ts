import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrUpdateProductDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description: string;

  @IsOptional()
  @IsDate()
  availableStartAt: Date;

  @IsOptional()
  @IsDate()
  availableEndAt: Date;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  value: number;

  @IsOptional()
  @IsString()
  picture: string;
}
