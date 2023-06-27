import { Entity, ObjectId } from './entity';

export class AnimalEntity extends Entity {
  name: string;
  description?: string;
  type: string;
  age: number;
  sex: string;
  orphanageDate?: Date;
  shelterId?: ObjectId;
  userId?: ObjectId;

  constructor(object: Partial<AnimalEntity>) {
    super();
    Object.assign(this, object);
  }
}
