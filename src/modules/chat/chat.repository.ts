import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { calculatePagination } from 'src/common/utils/calculatePagination';
import { ChatEntity } from 'src/core/entities/chat-entity';
import { IChatRepository } from 'src/core/interfaces/chat-repository';
import { Paginated } from 'src/core/interfaces/repository';
import { ChatModel } from 'src/typeorm/models/chat.model';
import { In, Repository as TypeOrmRepository } from 'typeorm';

@Injectable()
export class ChatRepository implements IChatRepository {
  constructor(
    @InjectRepository(ChatModel)
    private chatModel: TypeOrmRepository<ChatModel>,
  ) {}

  async get(id: number) {
    const chat = await this.chatModel.findOne({
      where: { id },
      relations: {
        messages: true,
        users: true,
      },
    });
    return new ChatEntity(chat);
  }

  async getAll(filter: any, limit?: number, page?: number) {
    const { take, skip } = calculatePagination(limit, page);

    const [chats, count] = await this.chatModel.findAndCount({
      ...filter,
      relations: {
        messages: true,
        users: true,
      },
      take,
      skip,
    });

    const result = {
      result: chats.map((c) => new ChatEntity(c)),
      limit: take,
      page: page,
      pages: Math.ceil(count / take),
      count,
    };
    return result;
  }

  async getUserChats(userId: number) {
    const chats = await this.chatModel.find({
      relations: {
        users: true,
      },
      where: {
        users: {
          id: In([userId]),
        },
      },
    });

    return chats.map((c) => new ChatEntity(c));
  }

  async getChatsByUsers(users: number[]) {
    const chats = await this.chatModel.find({
      relations: {
        users: true,
      },
      where: {
        users: {
          id: In(users),
        },
      },
    });

    return chats.map((c) => new ChatEntity(c));
  }

  async create(data: Omit<ChatEntity, 'id'>) {
    const chat = this.chatModel.create(data);
    const created = await this.chatModel.save(chat);
    return new ChatEntity(created);
  }

  async update(
    id: number,
    data: Partial<Omit<ChatEntity, 'id'>>,
  ): Promise<ChatEntity> {
    throw new Error('Method not implemented.');
  }

  async delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
