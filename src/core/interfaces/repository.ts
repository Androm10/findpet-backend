import { Entity, ObjectId } from '../entities/entity';

export interface Repository<T extends Entity> {
  get(id: ObjectId): Promise<T>;
  getAll(): Promise<T[]>;
  create(data: Omit<T, 'id'>): Promise<T>;
  update(id: ObjectId, data: Partial<Omit<T, 'id'>>): Promise<T>;
  delete(id: ObjectId): Promise<boolean>;
}
