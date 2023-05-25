import { ObjectId } from 'typeorm';
import { Entity } from './entity';

export class AnimalEntity extends Entity {
  name: string;
  description?: string;
  type: string;
  age: number;
  sex: string;
  orphanageDate?: Date;
  shelterId?: number;
  userId?: number;

  constructor(object: Partial<AnimalEntity>) {
    super();
    Object.assign(this, object);
  }
}
