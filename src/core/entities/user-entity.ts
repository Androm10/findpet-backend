import { Entity } from './entity';

export class UserEntity extends Entity {
  login: string;
  username: string;
  password: string;
  avatar?: any;
  shelterId?: number;

  constructor(object: Partial<UserEntity>) {
    super();
    Object.assign(this, object);
  }
}
