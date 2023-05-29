import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class AddShelterPhotosDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  @IsOptional()
  files: any;
}
