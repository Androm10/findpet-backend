import { IsArray, IsOptional, IsString, Length } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @Length(3, 40)
  name: string;

  @IsString()
  text: string;

  @IsOptional()
  @IsArray()
  animals: number[];

  shelterId: number;
}
