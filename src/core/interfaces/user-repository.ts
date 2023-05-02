import { ObjectId } from '../entities/entity';
import { UserEntity } from '../entities/user-entity';
import { Repository } from './repository';

export interface IUserRepository extends Repository<UserEntity> {
  getByLogin(login: string): Promise<UserEntity>;
  assignRole(userId: ObjectId, roleName: string): Promise<UserEntity>;
}
