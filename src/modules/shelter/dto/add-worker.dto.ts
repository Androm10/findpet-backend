import { IsEmail } from 'class-validator';

export class AddWorkerDto {
  @IsEmail()
  email: string;
}
