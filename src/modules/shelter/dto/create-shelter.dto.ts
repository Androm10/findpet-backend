import { Type } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Coords } from 'src/core/value-objects/coordinates.value-object';

export class CreateShelterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ValidateNested({ each: true })
  @Type(() => Coords)
  coords: Coords;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsUrl()
  contactUrl?: string;
}
