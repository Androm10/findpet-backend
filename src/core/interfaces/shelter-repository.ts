import { ShelterEntity } from '../entities/shelter-entity';
import { Repository } from './repository';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IShelterRepository extends Repository<ShelterEntity> {}
