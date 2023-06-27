import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class AddPostsPhotosDto {
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  @IsOptional()
  files: any;
}
