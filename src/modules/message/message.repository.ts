import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { calculatePagination } from 'src/common/utils/calculatePagination';
import { MessageEntity } from 'src/core/entities/message-entity';
import { IMessageRepository } from 'src/core/interfaces/message-repository';
import { Paginated } from 'src/core/interfaces/repository';
import { ChatModel } from 'src/typeorm/models/chat.model';
import { MessageModel } from 'src/typeorm/models/message.model';
import { Repository as TypeOrmRepository } from 'typeorm';

@Injectable()
export class MessageRepository implements IMessageRepository {
  constructor(
    @InjectRepository(MessageModel)
    private messageModel: TypeOrmRepository<MessageModel>,
  ) {}

  get(id: number): Promise<MessageEntity> {
    throw new Error('Method not implemented.');
  }

  getAll(
    filter: any,
    limit?: number,
    page?: number,
  ): Promise<Paginated<MessageEntity>> {
    throw new Error('Method not implemented.');
  }

  create(data: Omit<MessageEntity, 'id'>): Promise<MessageEntity> {
    throw new Error('Method not implemented.');
  }

  update(
    id: number,
    data: Partial<Omit<MessageEntity, 'id'>>,
  ): Promise<MessageEntity> {
    throw new Error('Method not implemented.');
  }

  delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
