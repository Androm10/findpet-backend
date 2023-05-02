import { ObjectId } from '../entities/entity';
import { ShelterEntity } from '../entities/shelter-entity';
import { Repository } from './repository';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IShelterRepository extends Repository<ShelterEntity> {
  create(
    data: Omit<ShelterEntity, 'id'>,
    creatorId?: ObjectId,
  ): Promise<ShelterEntity>;

  addWorker(shelterId: ObjectId, workerId: ObjectId): Promise<ShelterEntity>;
}
