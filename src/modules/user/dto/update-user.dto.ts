import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  login: string;

  @IsOptional()
  @MinLength(3)
  username: string;
}
