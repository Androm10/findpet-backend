import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MESSAGE_REPOSITORY } from 'src/common/constants/tokens';
import { ChatModel } from 'src/typeorm/models/chat.model';
import { MessageModel } from 'src/typeorm/models/message.model';
import { MessageRepository } from './message.repository';
import { MessageService } from './message.service';

@Module({
  imports: [TypeOrmModule.forFeature([MessageModel])],
  providers: [
    MessageService,
    {
      provide: MESSAGE_REPOSITORY,
      useClass: MessageRepository,
    },
  ],
  exports: [MessageService],
})
export class ChatModule {}
