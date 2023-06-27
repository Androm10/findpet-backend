import { AnimalEntity } from './animal-entity';
import { Entity, ObjectId } from './entity';
import { PhotoEntity } from './photo.entity';
import { ShelterEntity } from './shelter-entity';

export class PostEntity extends Entity {
  name: string;
  text: string;
  shelterId: ObjectId;
  isEdited: boolean;
  publishDate: Date | null;
  shelter?: ShelterEntity;
  photos?: PhotoEntity[];
  animals?: AnimalEntity[];

  constructor(object: Partial<ShelterEntity>) {
    super();
    Object.assign(this, object);
  }
}
