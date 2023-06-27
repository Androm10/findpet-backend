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

  async get(id: number) {
    const message = await this.messageModel.findOne({
      where: { id },
      relations: { user: true },
    });
    return new MessageEntity(message);
  }

  async getAll(
    filter: any,
    limit?: number,
    page?: number,
  ): Promise<Paginated<MessageEntity>> {
    const { take, skip } = calculatePagination(limit, page);

    const [messages, count] = await this.messageModel.findAndCount({
      ...filter,
      relations: {
        user: true,
      },
      take,
      skip,
    });

    const result = {
      result: messages.map((m) => new MessageEntity(m)),
      limit: take,
      page: page,
      pages: Math.ceil(count / take),
      count,
    };
    return result;
  }

  async create(data: Omit<MessageEntity, 'id'>): Promise<MessageEntity> {
    const message = this.messageModel.create(data);
    const created = await this.messageModel.save(message);
    return new MessageEntity(created);
  }

  update(
    id: number,
    data: Partial<Omit<MessageEntity, 'id'>>,
  ): Promise<MessageEntity> {
    throw new Error('Method not implemented.');
  }

  async delete(id: number): Promise<boolean> {
    await this.messageModel.delete({ id });
    return true;
  }
}
