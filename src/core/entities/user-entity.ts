import { Entity, ObjectId } from './entity';

export class UserEntity extends Entity {
  login: string;
  username: string;
  password: string;
  avatar?: any;
  shelterId?: ObjectId;
  isOnline: boolean;
  lastOnlineDate: Date;

  constructor(object: Partial<UserEntity>) {
    super();
    Object.assign(this, object);
  }
}
