import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAnimalDto {
  @IsString()
  name: string;

  @IsOptional()
  description?: string;

  @IsString()
  type: string;

  @IsNumber()
  age: number;

  @IsOptional()
  @IsDate()
  orphanageDate?: Date;
}
