import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm';
import { Repository } from 'src/core/interfaces/repository';
import { AnimalEntity } from 'src/core/entities/animal-entity';
import { AnimalModel } from 'src/typeorm/models/animal.model';
import { calculatePagination } from 'src/common/utils/calculatePagination';
import { IAnimalRepository } from 'src/core/interfaces/animal-repository';
import { ShelterModel, UserModel } from 'src/typeorm/models';
import { RepositoryError } from 'src/common/types/repository-error';

@Injectable()
export class AnimalRepository implements IAnimalRepository {
  constructor(
    @InjectRepository(AnimalModel)
    private animalModel: TypeOrmRepository<AnimalModel>,
  ) {}

  async get(id: number): Promise<AnimalEntity> {
    const animal = await this.animalModel.findOne({ where: { id } });
    return new AnimalEntity(animal);
  }

  async getAll(filter: any, limit?: number, page?: number) {
    const { take, skip } = calculatePagination(limit, page);

    const [animals, count] = await this.animalModel.findAndCount({
      ...filter,
      take,
      skip,
    });

    const result = {
      result: animals.map((a) => new AnimalEntity(a)),
      limit: take,
      page: page,
      pages: Math.ceil(count / take),
      count,
    };

    return result;
  }

  async create(data: Omit<AnimalEntity, 'id'>): Promise<AnimalEntity> {
    const animal = this.animalModel.create(data);
    if (data.shelterId) {
      animal.shelter = { id: data.shelterId } as ShelterModel;
    }
    if (data.userId) {
      animal.user = { id: data.userId } as UserModel;
    }
    const created = await this.animalModel.save(animal);
    return new AnimalEntity(created);
  }

  async update(
    id: number,
    data: Partial<Omit<AnimalEntity, 'id'>>,
  ): Promise<AnimalEntity> {
    await this.animalModel.update({ id }, data);

    return new AnimalEntity({ ...data, id });
  }

  async delete(id: number): Promise<boolean> {
    await this.animalModel.delete({ id });
    return true;
  }

  async makeFavorite(animalId: number, userId: number): Promise<AnimalEntity> {
    const animal = await this.animalModel.findOne({
      where: { id: animalId },
      relations: {
        favoritedBy: true,
      },
    });

    if (!animal) {
      throw new RepositoryError('No such animal');
    }

    animal.favoritedBy.push({ id: userId } as UserModel);
    const saved = await this.animalModel.save(animal);
    return new AnimalEntity(saved);
  }
}
