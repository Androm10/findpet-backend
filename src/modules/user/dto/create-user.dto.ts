import { IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  login: string;

  @MinLength(3)
  password: string;

  @MinLength(3)
  username: string;
}
