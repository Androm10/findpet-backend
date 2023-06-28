import { Inject, Injectable } from '@nestjs/common';
import { CHAT_REPOSITORY } from 'src/common/constants/tokens';
import { ChatEntity } from 'src/core/entities/chat-entity';
import { UserEntity } from 'src/core/entities/user-entity';
import { IChatRepository } from 'src/core/interfaces/chat-repository';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @Inject(CHAT_REPOSITORY) private chatRepository: IChatRepository,
  ) {}

  async get(id: number, userId: number) {
    const chat = await this.chatRepository.get(id);
    if (!chat.users.find((u) => u.id == userId)) {
      return null;
    }
    return chat;
  }

  async getAll(filter: any, limit: number, page: number) {
    return this.chatRepository.getAll(filter, limit, page);
  }

  async getUserChats(userId: number) {
    return this.chatRepository.getUserChats(userId);
  }

  async getChatsByUsers(users: number[]) {
    return this.chatRepository.getChatsByUsers(users);
  }

  async create(data: CreateChatDto) {
    const chat = {
      users: data.users.map((id) => ({
        id,
      })) as UserEntity[],
    };

    return this.chatRepository.create(chat);
  }

  async delete(id: number) {
    return this.chatRepository.delete(id);
  }
}
