import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class PatchSquadDto {
  @IsString()
  @MaxLength(255)
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  squadLeaderId: number;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  description: string | null;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  color: string | null;

  @IsString()
  @IsOptional()
  logo: string | null;
}
