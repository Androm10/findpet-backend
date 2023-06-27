import { Inject, Injectable } from '@nestjs/common';
import {
  CHAT_REPOSITORY,
  MESSAGE_REPOSITORY,
} from 'src/common/constants/tokens';
import { ChatEntity } from 'src/core/entities/chat-entity';
import { UserEntity } from 'src/core/entities/user-entity';
import { IChatRepository } from 'src/core/interfaces/chat-repository';
import { IMessageRepository } from 'src/core/interfaces/message-repository';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @Inject(MESSAGE_REPOSITORY) private messageRepository: IMessageRepository,
  ) {}

  async get(id: number) {
    return this.messageRepository.get(id);
  }

  async getAll(filter: any, limit: number, page: number) {
    return this.messageRepository.getAll(filter, limit, page);
  }

  async create(data: CreateMessageDto) {
    const message = {
      ...data,
      date: new Date(),
    };
    return this.messageRepository.create(message);
  }

  async delete(id: number) {
    return this.messageRepository.delete(id);
  }
}
