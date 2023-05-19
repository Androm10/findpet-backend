import { ObjectId } from '../entities/entity';
import { PhotoEntity } from '../entities/photo.entity';
import { Repository } from './repository';

export interface IPhotoRepository extends Repository<PhotoEntity> {
  bulkCreate(data: Array<Omit<PhotoEntity, 'id'>>): Promise<PhotoEntity[]>;

  bulkDelete(data: Array<ObjectId>): Promise<boolean[]>;
}
