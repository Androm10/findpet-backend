import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateAvatarDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  avatar: any;
}
