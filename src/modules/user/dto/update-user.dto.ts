import { IsEmail, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  login: string;

  @MinLength(3)
  username: string;
}
