import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CHAT_REPOSITORY } from 'src/common/constants/tokens';
import { ChatModel } from 'src/typeorm/models/chat.model';
import { ChatController } from './chat.controller';
import { ChatRepository } from './chat.repository';
import { ChatService } from './chat.service';

@Module({
  controllers: [ChatController],
  imports: [TypeOrmModule.forFeature([ChatModel])],
  providers: [
    ChatService,
    {
      provide: CHAT_REPOSITORY,
      useClass: ChatRepository,
    },
  ],
  exports: [ChatService],
})
export class ChatModule {}
