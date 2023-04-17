import { Entity } from './entity';

export class UserEntity extends Entity {
  login: string;
  username: string;
  password: string;

  constructor(object: Partial<UserEntity>) {
    super();
    Object.assign(this, object);
  }
}
