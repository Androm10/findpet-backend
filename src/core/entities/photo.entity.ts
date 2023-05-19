import { Entity } from './entity';

export class PhotoEntity extends Entity {
  name: string;
  url: string;

  constructor(object: Partial<PhotoEntity>) {
    super();
    Object.assign(this, object);
  }
}
