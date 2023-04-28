import { PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CityEntity } from 'src/core/entities/city.entity';
import { Coords } from 'src/core/value-objects/coordinates.value-object';

class CityDto extends PartialType(CityEntity) {}

export class CreateShelterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @Type(() => Coords)
  @ValidateNested()
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

  @IsOptional()
  @Type(() => CityDto)
  @ValidateNested()
  city: CityDto;
}
