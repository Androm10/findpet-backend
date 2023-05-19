import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm';
import { PhotoEntity } from 'src/core/entities/photo.entity';
import { IPhotoRepository } from 'src/core/interfaces/photo-repository';
import { Paginated } from 'src/core/interfaces/repository';
import { PhotoModel } from 'src/typeorm/models';

@Injectable()
export class PhotoRepository implements IPhotoRepository {
  constructor(
    @InjectRepository(PhotoModel)
    private photoModel: TypeOrmRepository<PhotoModel>,
  ) {}

  async bulkCreate(data: Omit<PhotoEntity, 'id'>[]): Promise<PhotoEntity[]> {
    const createdPhotos = this.photoModel.create(data);
    const saved = await this.photoModel.save(createdPhotos);

    return saved.map((c) => new PhotoEntity(c));
  }

  bulkDelete(data: number[]): Promise<boolean[]> {
    throw new Error('Method not implemented.');
  }
  get(id: number): Promise<PhotoEntity> {
    throw new Error('Method not implemented.');
  }
  getAll(
    filter: any,
    limit?: number,
    page?: number,
  ): Promise<Paginated<PhotoEntity>> {
    throw new Error('Method not implemented.');
  }
  create(data: Omit<PhotoEntity, 'id'>): Promise<PhotoEntity> {
    throw new Error('Method not implemented.');
  }
  update(
    id: number,
    data: Partial<Omit<PhotoEntity, 'id'>>,
  ): Promise<PhotoEntity> {
    throw new Error('Method not implemented.');
  }
  delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
