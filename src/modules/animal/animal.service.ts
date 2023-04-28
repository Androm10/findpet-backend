import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ANIMAL_REPOSITORY } from 'src/common/constants/tokens';
import { AnimalEntity } from 'src/core/entities/animal-entity';
import { IAnimalRepository } from 'src/core/interfaces/animal-repository';

@Injectable()
export class AnimalService {
  constructor(
    @Inject(ANIMAL_REPOSITORY)
    private animalRepository: IAnimalRepository,
  ) {}

  get(id: number): Promise<AnimalEntity> {
    return this.animalRepository.get(id);
  }

  getByShelterId(id: number, limit?: number, page?: number) {
    return this.animalRepository.getAll(
      { where: { shelter: { id } } },
      limit,
      page,
    );
  }

  getByUserId(id: number, limit?: number, page?: number) {
    return this.animalRepository.getAll(
      { where: { user: { id } } },
      limit,
      page,
    );
  }

  getAll(filter?: any, limit?: number, page?: number) {
    return this.animalRepository.getAll(filter, limit, page);
  }

  create(data: Omit<AnimalEntity, 'id'>): Promise<AnimalEntity> {
    return this.animalRepository.create(data);
  }

  update(
    id: number,
    data: Partial<Omit<AnimalEntity, 'id'>>,
  ): Promise<AnimalEntity> {
    return this.animalRepository.update(id, data);
  }

  async makeFavorite(id: number, userId: number) {
    const animal = await this.get(id);
    if (!animal) {
      throw new NotFoundException('No such animal');
    }
    this.animalRepository.makeFavorite(id, userId);
  }

  delete(id: number): Promise<boolean> {
    return this.animalRepository.delete(id);
  }
}
