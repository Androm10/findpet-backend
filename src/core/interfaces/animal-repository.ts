import { AnimalEntity } from '../entities/animal-entity';
import { ObjectId } from '../entities/entity';
import { Repository } from './repository';

export interface IAnimalRepository extends Repository<AnimalEntity> {
  makeFavorite(animalId: ObjectId, userId: ObjectId): Promise<AnimalEntity>;
}
