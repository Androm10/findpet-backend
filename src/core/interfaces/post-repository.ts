import { ObjectId } from '../entities/entity';
import { PostEntity } from '../entities/post-entity';
import { Repository } from './repository';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPostRepository extends Repository<PostEntity> {
  getAny(id: ObjectId): Promise<PostEntity>;
}
