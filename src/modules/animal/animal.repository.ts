import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm';
import { Repository } from 'src/core/interfaces/repository';
import { AnimalEntity } from 'src/core/entities/animal-entity';
import { AnimalModel } from 'src/typeorm/models/animal.model';

@Injectable()
export class AnimalRepository implements Repository<AnimalEntity> {
  constructor(
    @InjectRepository(AnimalModel)
    private animalModel: TypeOrmRepository<AnimalModel>,
  ) {}

  async get(id: number): Promise<AnimalEntity> {
    const animal = await this.animalModel.findOne({ where: { id } });
    return new AnimalEntity(animal);
  }

  async getAll(): Promise<AnimalEntity[]> {
    const animals = await this.animalModel.find();
    return animals.map((a) => new AnimalEntity(a));
  }

  async create(data: Omit<AnimalEntity, 'id'>): Promise<AnimalEntity> {
    const animal = await this.animalModel.create(data);
    this.animalModel.save(animal);
    return new AnimalEntity(animal);
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
}
