import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class CreateChatDto {
  @IsArray()
  users: number[];
}
