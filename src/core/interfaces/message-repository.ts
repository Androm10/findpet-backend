import { ObjectId } from '../entities/entity';
import { MessageEntity } from '../entities/message-entity';
import { Repository } from './repository';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IMessageRepository extends Repository<MessageEntity> {}
