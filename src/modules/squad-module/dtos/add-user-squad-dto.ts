import { IsNumber } from 'class-validator';

export class AddUserSquadDto {
  @IsNumber()
  id: number;
}
