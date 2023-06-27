import { IsArray, IsOptional } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  text?: string;

  @IsOptional()
  @IsArray()
  animals?: number[];
}
