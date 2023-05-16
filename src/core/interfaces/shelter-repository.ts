import { ObjectId } from '../entities/entity';
import { ShelterEntity } from '../entities/shelter-entity';
import { UserEntity } from '../entities/user-entity';
import { Coords } from '../value-objects/coordinates.value-object';
import { Paginated, Repository } from './repository';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IShelterRepository extends Repository<ShelterEntity> {
  create(
    data: Omit<ShelterEntity, 'id'>,
    creatorId?: ObjectId,
  ): Promise<ShelterEntity>;

  addWorker(shelterId: ObjectId, workerId: ObjectId): Promise<ShelterEntity>;

  getWorkers(shelterId: ObjectId): Promise<UserEntity[]>;

  getNearest(
    coords: Coords,
    limit?: number,
    page?: number,
  ): Promise<Paginated<ShelterEntity>>;
}
