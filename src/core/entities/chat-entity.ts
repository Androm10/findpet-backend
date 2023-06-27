import { Entity } from './entity';
import { MessageEntity } from './message-entity';
import { UserEntity } from './user-entity';

export class ChatEntity extends Entity {
  users: UserEntity[];
  messages?: MessageEntity[];

  constructor(object: Partial<ChatEntity>) {
    super();
    Object.assign(this, object);
  }
}
