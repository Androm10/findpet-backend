import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/core/entities/user-entity';
import { Repository } from 'src/core/interfaces/repository';

@Injectable()
export class UserRepository implements Repository<UserEntity> {
  get(id: number): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }
  getAll(): Promise<UserEntity[]> {
    throw new Error('Method not implemented.');
  }
  create(data: Omit<UserEntity, 'id'>): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }
  update(
    id: number,
    data: Partial<Omit<UserEntity, 'id'>>,
  ): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }
  delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
