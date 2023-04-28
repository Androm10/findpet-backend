import { Entity, ObjectId } from '../entities/entity';

export interface Repository<T extends Entity> {
  get(id: ObjectId): Promise<T>;
  getAll(filter: any, limit?: number, page?: number): Promise<Paginated<T>>;
  create(data: Omit<T, 'id'>): Promise<T>;
  update(id: ObjectId, data: Partial<Omit<T, 'id'>>): Promise<T>;
  delete(id: ObjectId): Promise<boolean>;
}

export interface Paginated<T> {
  result: T[];
  limit: number;
  count: number;
  page: number;
  pages: number;
}
