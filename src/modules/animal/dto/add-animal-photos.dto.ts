import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddAnimalPhotosDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  @IsOptional()
  files: any;
}
