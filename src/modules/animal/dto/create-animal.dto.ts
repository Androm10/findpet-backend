import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAnimalDto {
  @IsString()
  name: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  shelterId?: number;

  @IsOptional()
  userId?: number;

  @IsString()
  type: string;

  @IsString()
  sex: string;

  @IsNumber()
  age: number;

  @IsOptional()
  @IsDate()
  orphanageDate?: Date;
}
