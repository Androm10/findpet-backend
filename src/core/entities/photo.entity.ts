import { AnimalEntity } from './animal-entity';
import { Entity } from './entity';
import { ShelterEntity } from './shelter-entity';
import { UserEntity } from './user-entity';

export class PhotoEntity extends Entity {
  name: string;
  url: string;

  constructor(object: Partial<PhotoEntity>) {
    super();
    Object.assign(this, object);
  }
}
