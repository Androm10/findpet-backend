import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetPostsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsArray()
  animals?: number[];

  @IsOptional()
  @IsNumber()
  shelterId: number;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
