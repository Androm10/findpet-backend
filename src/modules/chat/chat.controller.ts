import {
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NoAuth } from 'src/common/decorators/no-auth.decorator';
import { UserRequest } from 'src/common/decorators/user.decorator';
import { UserFromRequest } from 'src/common/types/user-request';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chat')
@ApiTags('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get(':id')
  get(@Param('id') id: number) {
    return this.chatService.get(id);
  }

  @Get()
  getAll(@Query('limit') limit: number, @Query('page') page: number) {
    return this.chatService.getAll({}, limit, page);
  }

  @Post()
  create(
    @Body() createChatDto: CreateChatDto,
    @UserRequest() user: UserFromRequest,
  ) {
    createChatDto.users.push(user.id);
    return this.chatService.create(createChatDto);
  }
}
