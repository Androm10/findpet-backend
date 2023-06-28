import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository as TypeOrmRepository } from 'typeorm';
import { PhotoEntity } from 'src/core/entities/photo.entity';
import { IPhotoRepository } from 'src/core/interfaces/photo-repository';
import { PhotoModel } from 'src/typeorm/models';
import { calculatePagination } from 'src/common/utils/calculatePagination';

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

  async create(data: Omit<PhotoEntity, 'id'>) {
    const createdPhotos = this.photoModel.create(data);
    const saved = await this.photoModel.save(createdPhotos);

    return new PhotoEntity(saved);
  }

  async get(id: number) {
    const photo = await this.photoModel.findOne({ where: { id } });
    return new PhotoEntity(photo);
  }

  async getAll(filter: any, limit?: number, page?: number) {
    const { take, skip } = calculatePagination(limit, page);

    const [photos, count] = await this.photoModel.findAndCount({
      ...filter,
      take,
      skip,
    });

    const result = {
      result: photos.map((a) => new PhotoEntity(a)),
      limit: take,
      page: page,
      pages: Math.ceil(count / take),
      count,
    };

    return result;
  }

  async update(id: number, data: Partial<Omit<PhotoEntity, 'id'>>) {
    const updated = await this.photoModel.update({ id }, data);
    return new PhotoEntity({ ...data, id });
  }

  async delete(id: number) {
    await this.photoModel.delete({ id });
    return true;
  }

  async bulkDelete(data: number[]) {
    await this.photoModel.delete({
      id: In(data),
    });

    return true;
  }
}
