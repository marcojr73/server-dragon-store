import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateOrUpdateSquadDto {
  @IsString()
  @MaxLength(255)
  @IsOptional()
  name: string;

  @IsNumber()
  squadLeaderId: number;

  @IsString()
  @MaxLength(255)
  description: string | null;

  @IsString()
  @MaxLength(255)
  color: string | null;

  @IsString()
  logo: string | null;
}
