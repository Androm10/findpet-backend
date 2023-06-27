import { ChatEntity } from './chat-entity';
import { Entity, ObjectId } from './entity';
import { UserEntity } from './user-entity';

export class MessageEntity extends Entity {
  text: string;
  chatId: ObjectId;
  chat?: ChatEntity;
  userId: ObjectId;
  user?: UserEntity;
  date: Date;

  constructor(object: Partial<MessageEntity>) {
    super();
    Object.assign(this, object);
  }
}
