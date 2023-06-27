import { Coords } from '../value-objects/coordinates.value-object';
import { AnimalEntity } from './animal-entity';
import { Entity, ObjectId } from './entity';
import { PhotoEntity } from './photo.entity';

export class ShelterEntity extends Entity {
  name: string;
  text: string;
  shelterId: ObjectId;
  shelter?: ShelterEntity;
  photos?: PhotoEntity[];
  animals?: AnimalEntity[];

  constructor(object: Partial<ShelterEntity>) {
    super();
    Object.assign(this, object);
  }
}
