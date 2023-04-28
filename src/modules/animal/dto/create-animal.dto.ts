import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAnimalDto {
  @IsString()
  name: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  shelterId?: number;

  @IsString()
  type: string;

  @IsNumber()
  age: number;

  @IsOptional()
  @IsDate()
  orphanageDate?: Date;
}
