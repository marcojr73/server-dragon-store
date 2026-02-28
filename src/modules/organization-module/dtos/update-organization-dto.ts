import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsHexColor } from '@core/decorators/is-hex-color-validator';

export class UpdateOrganizationDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsHexColor()
  color?: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  responsibleName?: string;

  @IsEmail()
  @IsOptional()
  responsibleEmail?: string;

  @IsString()
  @IsOptional()
  responsiblePhone?: string;

  @IsNumber()
  @IsOptional()
  reportSendInterval?: number;

  @IsNumber()
  @IsOptional()
  coinsSupply?: number;

  @IsNumber()
  @IsOptional()
  maxRedemptions?: number | null;
}
