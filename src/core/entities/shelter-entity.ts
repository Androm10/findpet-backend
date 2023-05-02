import { Coords } from '../value-objects/coordinates.value-object';
import { Entity } from './entity';

export class ShelterEntity extends Entity {
  name: string;
  coords: Coords;
  description?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactUrl?: string;
  isVerified?: boolean;

  constructor(object: Partial<ShelterEntity>) {
    super();
    Object.assign(this, object);
  }
}
