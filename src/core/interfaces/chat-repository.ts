import { ChatEntity } from '../entities/chat-entity';
import { ObjectId } from '../entities/entity';
import { Repository } from './repository';

export interface IChatRepository extends Repository<ChatEntity> {
  getUserChats(userId: ObjectId): Promise<ChatEntity[]>;
  getChatsByUsers(users: ObjectId[]): Promise<ChatEntity[]>;
}
