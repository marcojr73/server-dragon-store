import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateOrUpdateUserDto {
  @IsString()
  userName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  picture: string | null;

  @IsBoolean()
  isAdmin: boolean;

  @IsString()
  @IsOptional()
  password?: string;
}
